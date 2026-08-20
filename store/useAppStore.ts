import { create } from 'zustand';
import { MODEL_CATALOG } from '../constants/models';
import {
  getAppSettings,
  getDownloadedModels,
  getUserProfile,
  saveAppSettings,
  saveUserProfile,
  upsertDownloadedModel,
  deleteDownloadedModel as removeDownloadedModelFromDb,
} from '../services/storage';
import {
  cancelDownload,
  deleteModelFile,
  getModelFilePath,
  hasEnoughDiskSpace,
  isModelFileDownloaded,
  pauseDownload,
  resumeDownload,
  startDownload,
} from '../services/downloads';
import { loadModel, unloadModel } from '../services/llm';
import {
  AppearanceMode,
  AppLanguage,
  DownloadedModel,
  UserProfile,
} from '../types';

interface AppState {
  // Ajustes
  appearance: AppearanceMode;
  language: AppLanguage;
  activeModelId: string | null;
  userProfile: UserProfile;

  // Modelos descargados: id -> info
  downloadedModels: Record<string, DownloadedModel>;

  // Estado de UI
  isModelLoading: boolean;
  modelLoadError: string | null;

  // Acciones de inicialización
  hydrate: () => void;

  // Ajustes
  setAppearance: (mode: AppearanceMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setUserProfile: (profile: UserProfile) => void;

  // Modelos
  downloadModel: (modelId: string) => Promise<void>;
  pauseModelDownload: (modelId: string) => Promise<void>;
  resumeModelDownload: (modelId: string) => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;
  setActiveModel: (modelId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  appearance: 'dark',
  language: 'system',
  activeModelId: null,
  userProfile: { nickname: '', occupation: '', passions: '' },
  downloadedModels: {},
  isModelLoading: false,
  modelLoadError: null,

  hydrate: () => {
    const settings = getAppSettings();
    const profile = getUserProfile();
    const downloaded = getDownloadedModels();
    const downloadedMap: Record<string, DownloadedModel> = {};
    downloaded.forEach((m) => {
      downloadedMap[m.id] = m;
    });

    set({
      appearance: settings.appearance,
      language: settings.language,
      activeModelId: settings.activeModelId,
      userProfile: profile,
      downloadedModels: downloadedMap,
    });
  },

  setAppearance: (mode) => {
    set({ appearance: mode });
    const { language, activeModelId } = get();
    saveAppSettings({ appearance: mode, language, activeModelId });
  },

  setLanguage: (lang) => {
    set({ language: lang });
    const { appearance, activeModelId } = get();
    saveAppSettings({ appearance, language: lang, activeModelId });
  },

  setUserProfile: (profile) => {
    set({ userProfile: profile });
    saveUserProfile(profile);
  },

  downloadModel: async (modelId) => {
    const model = MODEL_CATALOG.find((m) => m.id === modelId);
    if (!model) return;

    if (!hasEnoughDiskSpace(model.sizeMB)) {
      set((state) => ({
        downloadedModels: {
          ...state.downloadedModels,
          [modelId]: {
            id: modelId,
            filePath: '',
            fileName: model.fileName,
            sizeMB: model.sizeMB,
            downloadedAt: 0,
            status: 'error',
            progress: 0,
          },
        },
      }));
      return;
    }

    set((state) => ({
      downloadedModels: {
        ...state.downloadedModels,
        [modelId]: {
          id: modelId,
          filePath: '',
          fileName: model.fileName,
          sizeMB: model.sizeMB,
          downloadedAt: 0,
          status: 'downloading',
          progress: 0,
        },
      },
    }));

    try {
      const uri = await startDownload(model, (progress) => {
        set((state) => ({
          downloadedModels: {
            ...state.downloadedModels,
            [modelId]: {
              ...state.downloadedModels[modelId],
              status: 'downloading',
              progress,
            },
          },
        }));
      });

      const downloadedModel: DownloadedModel = {
        id: modelId,
        filePath: uri,
        fileName: model.fileName,
        sizeMB: model.sizeMB,
        downloadedAt: Date.now(),
        status: 'downloaded',
        progress: 1,
      };

      upsertDownloadedModel(downloadedModel);

      set((state) => ({
        downloadedModels: {
          ...state.downloadedModels,
          [modelId]: downloadedModel,
        },
      }));
    } catch (error) {
      set((state) => ({
        downloadedModels: {
          ...state.downloadedModels,
          [modelId]: {
            ...state.downloadedModels[modelId],
            status: 'error',
          },
        },
      }));
    }
  },

  pauseModelDownload: async (modelId) => {
    await pauseDownload(modelId);
    set((state) => ({
      downloadedModels: {
        ...state.downloadedModels,
        [modelId]: {
          ...state.downloadedModels[modelId],
          status: 'paused',
        },
      },
    }));
  },

  resumeModelDownload: async (modelId) => {
    const model = MODEL_CATALOG.find((m) => m.id === modelId);
    if (!model) return;

    set((state) => ({
      downloadedModels: {
        ...state.downloadedModels,
        [modelId]: {
          ...state.downloadedModels[modelId],
          status: 'downloading',
        },
      },
    }));

    try {
      const uri = await resumeDownload(model, (progress) => {
        set((state) => ({
          downloadedModels: {
            ...state.downloadedModels,
            [modelId]: {
              ...state.downloadedModels[modelId],
              status: 'downloading',
              progress,
            },
          },
        }));
      });

      const downloadedModel: DownloadedModel = {
        id: modelId,
        filePath: uri,
        fileName: model.fileName,
        sizeMB: model.sizeMB,
        downloadedAt: Date.now(),
        status: 'downloaded',
        progress: 1,
      };

      upsertDownloadedModel(downloadedModel);

      set((state) => ({
        downloadedModels: {
          ...state.downloadedModels,
          [modelId]: downloadedModel,
        },
      }));
    } catch {
      set((state) => ({
        downloadedModels: {
          ...state.downloadedModels,
          [modelId]: {
            ...state.downloadedModels[modelId],
            status: 'error',
          },
        },
      }));
    }
  },

  deleteModel: async (modelId) => {
    const model = MODEL_CATALOG.find((m) => m.id === modelId);
    if (!model) return;

    cancelDownload(modelId);
    deleteModelFile(model);
    removeDownloadedModelFromDb(modelId);

    set((state) => {
      const updated = { ...state.downloadedModels };
      delete updated[modelId];
      const wasActive = state.activeModelId === modelId;
      return {
        downloadedModels: updated,
        activeModelId: wasActive ? null : state.activeModelId,
      };
    });

    if (get().activeModelId === null) {
      const { appearance, language } = get();
      saveAppSettings({ appearance, language, activeModelId: null });
      await unloadModel();
    }
  },

  setActiveModel: async (modelId) => {
    const model = MODEL_CATALOG.find((m) => m.id === modelId);
    if (!model) return;

    if (!isModelFileDownloaded(model)) return;

    set({ isModelLoading: true, modelLoadError: null });

    try {
      const path = getModelFilePath(model);
      await loadModel({ modelPath: path, contextLength: model.contextLength });
      set({ activeModelId: modelId, isModelLoading: false });
      const { appearance, language } = get();
      saveAppSettings({ appearance, language, activeModelId: modelId });
    } catch (error) {
      set({
        isModelLoading: false,
        modelLoadError: (error as Error).message,
      });
    }
  },
}));

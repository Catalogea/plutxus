import { Directory, File, Paths, DownloadTask } from 'expo-file-system';
import type { DownloadPauseState, DownloadProgress } from 'expo-file-system';
import { ModelCatalogItem } from '../../types';


export const modelsDirectory = new Directory(Paths.document, 'models');

export function ensureModelsDir(): void {
  if (!modelsDirectory.exists) {
    modelsDirectory.create({ intermediates: true });
  }
}

export function getModelFile(model: ModelCatalogItem): File {
  return new File(modelsDirectory, model.fileName);
}

export function getModelFilePath(model: ModelCatalogItem): string {
  return getModelFile(model).uri;
}

export function hasEnoughDiskSpace(requiredMB: number): boolean {
  const freeMB = Paths.availableDiskSpace / (1024 * 1024);
  // Dejamos un margen de seguridad de 200MB adicionales.
  return freeMB > requiredMB + 200;
}

export type DownloadProgressCallback = (progress: number) => void;

// Mantiene referencias activas a las descargas para poder pausar/reanudar/cancelar.
const activeDownloads = new Map<string, DownloadTask>();
const pausedStates = new Map<string, DownloadPauseState>();


export async function startDownload(
  model: ModelCatalogItem,
  onProgress: DownloadProgressCallback
): Promise<string> {
  ensureModelsDir();
  const destination = getModelFile(model);

  const task = File.createDownloadTask(model.downloadUrl, destination, {
    idempotent: true,
    onProgress: (data: DownloadProgress) => {
      if (data.totalBytes > 0) {
        onProgress(data.bytesWritten / data.totalBytes);
      }
    },
  } as any);


  activeDownloads.set(model.id, task);

  const result = await task.downloadAsync();
  activeDownloads.delete(model.id);

  if (!result) {
    // La descarga fue pausada antes de completarse.
    throw new Error('La descarga fue pausada.');
  }

  return result.uri;
}

export async function pauseDownload(modelId: string): Promise<boolean> {
  const task = activeDownloads.get(modelId);
  if (!task) return false;
  await task.pauseAsync();
  pausedStates.set(modelId, task.savable());
  return true;
}

export async function resumeDownload(
  model: ModelCatalogItem,
  onProgress: DownloadProgressCallback
): Promise<string> {
  const savedState = pausedStates.get(model.id);
  if (!savedState) {
    // No hay estado guardado, iniciar de nuevo.
    return startDownload(model, onProgress);
  }

  const task = DownloadTask.fromSavable(savedState, {
    onProgress: (data: DownloadProgress) => {
      if (data.totalBytes > 0) {
        onProgress(data.bytesWritten / data.totalBytes);
      }
    },
  } as any);


  activeDownloads.set(model.id, task);
  const result = await task.resumeAsync();
  activeDownloads.delete(model.id);

  if (!result) {
    throw new Error('La descarga fue pausada nuevamente.');
  }
  return result.uri;
}

export function cancelDownload(modelId: string): void {
  const task = activeDownloads.get(modelId);
  if (task) {
    task.cancel();
    activeDownloads.delete(modelId);
  }
  pausedStates.delete(modelId);
}

export function deleteModelFile(model: ModelCatalogItem): void {
  const file = getModelFile(model);
  if (file.exists) {
    file.delete();
  }
}

export function getModelFileSizeMB(model: ModelCatalogItem): number {
  const file = getModelFile(model);
  if (file.exists) {
    return (file.size ?? 0) / (1024 * 1024);
  }
  return 0;
}

export function isModelFileDownloaded(model: ModelCatalogItem): boolean {
  return getModelFile(model).exists;
}

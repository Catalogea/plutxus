// Tipos compartidos de la aplicación Plutxus

export type ModelQuant = 'Q4_K_M' | 'Q4_0' | 'Q5_K_M' | 'Q5_0' | 'Q6_K' | 'Q8_0';

export interface ModelCatalogItem {
  id: string;
  name: string;
  family: string;
  description: string;
  quant: ModelQuant;
  sizeMB: number;
  contextLength: number;
  supportsVision: boolean;
  downloadUrl: string;
  fileName: string;
  minRamGB: number;
  recommended?: boolean;
}

export type DownloadStatus =
  | 'not_downloaded'
  | 'downloading'
  | 'paused'
  | 'downloaded'
  | 'error';

export interface DownloadedModel {
  id: string; // coincide con ModelCatalogItem.id
  filePath: string;
  fileName: string;
  sizeMB: number;
  downloadedAt: number;
  status: DownloadStatus;
  progress: number; // 0 - 1
}

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  isGenerating?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  modelId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  nickname: string;
  occupation: string;
  passions: string;
}

export type AppearanceMode = 'light' | 'dark' | 'auto';

export type AppLanguage = 'system' | 'es' | 'en';

export interface AppSettings {
  appearance: AppearanceMode;
  language: AppLanguage;
  activeModelId: string | null;
}

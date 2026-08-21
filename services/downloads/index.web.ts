import { ModelCatalogItem } from '../../types';

export type DownloadProgressCallback = (progress: number) => void;

const webUnavailableMessage =
  'La descarga de modelos solo está disponible en la aplicación Android o iOS.';

export function getModelFilePath(model: ModelCatalogItem): string {
  return `web-preview://${model.fileName}`;
}

export function hasEnoughDiskSpace(_: number): boolean {
  return false;
}

export function isModelFileDownloaded(_: ModelCatalogItem): boolean {
  return false;
}

export async function startDownload(
  _: ModelCatalogItem,
  __: DownloadProgressCallback
): Promise<string> {
  throw new Error(webUnavailableMessage);
}

export async function pauseDownload(_: string): Promise<boolean> {
  return false;
}

export async function resumeDownload(
  _: ModelCatalogItem,
  __: DownloadProgressCallback
): Promise<string> {
  throw new Error(webUnavailableMessage);
}

export function cancelDownload(_: string): void {}

export function deleteModelFile(_: ModelCatalogItem): void {}
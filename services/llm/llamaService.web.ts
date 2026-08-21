import { ChatMessage } from '../../types';

export interface LoadModelOptions {
  modelPath: string;
  contextLength?: number;
}

export interface StreamCallbacks {
  onToken: (partialText: string, tokenText: string) => void;
  onComplete: (finalText: string) => void;
  onError: (error: Error) => void;
}

const webUnavailableMessage =
  'La IA local solo está disponible en la aplicación Android o iOS. El preview web permite editar la interfaz.';

export async function loadModel(_: LoadModelOptions): Promise<void> {
  throw new Error(webUnavailableMessage);
}

export async function unloadModel(): Promise<void> {}

export function isModelLoaded(): boolean {
  return false;
}

export function getLoadedModelPath(): string | null {
  return null;
}

export async function generateStreamingResponse(
  _: ChatMessage[],
  { onError }: StreamCallbacks
): Promise<void> {
  onError(new Error(webUnavailableMessage));
}

export async function stopGeneration(): Promise<void> {}
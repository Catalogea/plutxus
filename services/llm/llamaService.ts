import { initLlama, LlamaContext } from 'llama.rn';
import { Platform } from 'react-native';
import { ChatMessage } from '../../types';

let currentContext: LlamaContext | null = null;
let currentModelPath: string | null = null;

export interface LoadModelOptions {
  modelPath: string;
  contextLength?: number;
}

/**
 * Determina un número razonable de capas GPU a delegar según la plataforma.
 * llama.rn se encarga de usar Metal en iOS y OpenCL/Vulkan en Android
 * cuando están disponibles; aquí solo definimos un valor "alto" para que
 * el motor use aceleración cuando exista, y 0 como fallback seguro.
 */
function getPreferredGpuLayers(): number {
  // 99 le indica a llama.cpp que intente descargar todas las capas posibles a GPU.
  // Si no hay GPU disponible, internamente cae a CPU sin romper la ejecución.
  return Platform.OS === 'ios' || Platform.OS === 'android' ? 99 : 0;
}

export async function loadModel({
  modelPath,
  contextLength = 4096,
}: LoadModelOptions): Promise<void> {
  if (currentContext && currentModelPath === modelPath) {
    return; // ya está cargado
  }

  await unloadModel();

  try {
    currentContext = await initLlama({
      model: modelPath,
      n_ctx: contextLength,
      n_gpu_layers: getPreferredGpuLayers(),
      use_mlock: true,
    });
    currentModelPath = modelPath;
  } catch (error) {
    currentContext = null;
    currentModelPath = null;
    throw new Error(
      `No se pudo cargar el modelo. Es posible que el dispositivo no tenga suficiente RAM. Detalle: ${
        (error as Error).message
      }`
    );
  }
}

export async function unloadModel(): Promise<void> {
  if (currentContext) {
    try {
      await currentContext.release();
    } catch {
      // ignorar errores al liberar
    }
    currentContext = null;
    currentModelPath = null;
  }
}

export function isModelLoaded(): boolean {
  return currentContext !== null;
}

export function getLoadedModelPath(): string | null {
  return currentModelPath;
}

function buildPrompt(messages: ChatMessage[]): { role: string; content: string }[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export interface StreamCallbacks {
  onToken: (partialText: string, tokenText: string) => void;
  onComplete: (finalText: string) => void;
  onError: (error: Error) => void;
}

/**
 * Genera una respuesta en streaming a partir del historial de mensajes.
 * Usa la API de chat completion de llama.rn con callback por token.
 */
export async function generateStreamingResponse(
  messages: ChatMessage[],
  { onToken, onComplete, onError }: StreamCallbacks
): Promise<void> {
  if (!currentContext) {
    onError(new Error('No hay ningún modelo cargado.'));
    return;
  }

  let fullText = '';

  try {
    const chatMessages = buildPrompt(messages);

    await currentContext.completion(
      {
        messages: chatMessages,
        n_predict: 512,
        temperature: 0.7,
        top_p: 0.9,
        stop: ['</s>', '<|eot_id|>', '<|end|>'],
      },
      (data) => {
        if (data?.token) {
          fullText += data.token;
          onToken(fullText, data.token);
        }
      }
    );

    onComplete(fullText);
  } catch (error) {
    onError(error as Error);
  }
}

export async function stopGeneration(): Promise<void> {
  if (currentContext) {
    try {
      await currentContext.stopCompletion();
    } catch {
      // ignorar
    }
  }
}

import { ModelCatalogItem } from '../types';

// Catálogo curado de modelos GGUF cuantizados, pensados para dispositivos móviles.
// Los enlaces de descarga apuntan a repos comunitarios de Hugging Face con
// cuantizaciones GGUF listas para llama.cpp / llama.rn.
export const MODEL_CATALOG: ModelCatalogItem[] = [
  {
    id: 'gemma-2-2b-it-q4',
    name: 'Gemma 2 2B Instruct',
    family: 'Gemma',
    description: 'Modelo compacto de Google, buen balance velocidad/calidad.',
    quant: 'Q4_K_M',
    sizeMB: 1700,
    contextLength: 8192,
    supportsVision: false,
    downloadUrl:
      'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf',
    fileName: 'gemma-2-2b-it-Q4_K_M.gguf',
    minRamGB: 3,
    recommended: true,
  },
  {
    id: 'gemma-3n-e2b-it-q4',
    name: 'Gemma 3n E2B Instruct',
    family: 'Gemma',
    description: 'Versión multimodal ligera de Gemma 3n, soporta imágenes.',
    quant: 'Q4_K_M',
    sizeMB: 2200,
    contextLength: 8192,
    supportsVision: true,
    downloadUrl:
      'https://huggingface.co/bartowski/google_gemma-3n-E2B-it-GGUF/resolve/main/google_gemma-3n-E2B-it-Q4_K_M.gguf',
    fileName: 'gemma-3n-e2b-it-Q4_K_M.gguf',
    minRamGB: 4,
  },
  {
    id: 'qwen2.5-1.5b-instruct-q5',
    name: 'Qwen2.5 1.5B Instruct',
    family: 'Qwen',
    description: 'Rápido y eficiente, ideal para dispositivos con poca RAM.',
    quant: 'Q5_K_M',
    sizeMB: 1100,
    contextLength: 32768,
    supportsVision: false,
    downloadUrl:
      'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q5_k_m.gguf',
    fileName: 'qwen2.5-1.5b-instruct-Q5_K_M.gguf',
    minRamGB: 2,
    recommended: true,
  },
  {
    id: 'qwen2.5-3b-instruct-q4',
    name: 'Qwen2.5 3B Instruct',
    family: 'Qwen',
    description: 'Mayor capacidad de razonamiento, requiere más RAM.',
    quant: 'Q4_K_M',
    sizeMB: 2000,
    contextLength: 32768,
    supportsVision: false,
    downloadUrl:
      'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q4_k_m.gguf',
    fileName: 'qwen2.5-3b-instruct-Q4_K_M.gguf',
    minRamGB: 4,
  },
  {
    id: 'llama-3.2-1b-instruct-q4',
    name: 'Llama 3.2 1B Instruct',
    family: 'Llama',
    description: 'Modelo muy ligero de Meta, ideal para pruebas rápidas.',
    quant: 'Q4_K_M',
    sizeMB: 800,
    contextLength: 8192,
    supportsVision: false,
    downloadUrl:
      'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    fileName: 'llama-3.2-1b-instruct-Q4_K_M.gguf',
    minRamGB: 2,
  },
  {
    id: 'llama-3.2-3b-instruct-q4',
    name: 'Llama 3.2 3B Instruct',
    family: 'Llama',
    description: 'Buen equilibrio entre calidad de respuesta y tamaño.',
    quant: 'Q4_K_M',
    sizeMB: 2000,
    contextLength: 8192,
    supportsVision: false,
    downloadUrl:
      'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    fileName: 'llama-3.2-3b-instruct-Q4_K_M.gguf',
    minRamGB: 4,
  },
  {
    id: 'phi-4-mini-instruct-q4',
    name: 'Phi-4-mini Instruct',
    family: 'Phi',
    description: 'Modelo de Microsoft optimizado para razonamiento.',
    quant: 'Q4_K_M',
    sizeMB: 2500,
    contextLength: 16384,
    supportsVision: false,
    downloadUrl:
      'https://huggingface.co/bartowski/microsoft_Phi-4-mini-instruct-GGUF/resolve/main/microsoft_Phi-4-mini-instruct-Q4_K_M.gguf',
    fileName: 'phi-4-mini-instruct-Q4_K_M.gguf',
    minRamGB: 4,
  },
];

export function getModelById(id: string): ModelCatalogItem | undefined {
  return MODEL_CATALOG.find((m) => m.id === id);
}

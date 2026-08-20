import { create } from 'zustand';
import {
  addMessage,
  createChat,
  deleteChat as deleteChatFromDb,
  getAllChats,
  getMessagesForChat,
  renameChat as renameChatInDb,
  setChatModel,
  updateMessageContent,
} from '../services/storage';
import { generateStreamingResponse, stopGeneration } from '../services/llm';
import { Chat, ChatMessage } from '../types';
import { useAppStore } from './useAppStore';

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  messagesByChat: Record<string, ChatMessage[]>;
  isGenerating: boolean;

  loadChats: () => void;
  openChat: (chatId: string) => void;
  createNewChat: () => string;
  removeChat: (chatId: string) => void;
  renameCurrentChat: (chatId: string, title: string) => void;

  sendMessage: (text: string) => Promise<void>;
  stopCurrentGeneration: () => Promise<void>;
}

function buildSystemPrompt(): ChatMessage | null {
  const { userProfile } = useAppStore.getState();
  const parts: string[] = [];
  if (userProfile.nickname) parts.push(`El usuario se llama ${userProfile.nickname}.`);
  if (userProfile.occupation)
    parts.push(`Se dedica a: ${userProfile.occupation}.`);
  if (userProfile.passions) parts.push(`Sus pasiones son: ${userProfile.passions}.`);

  if (parts.length === 0) return null;

  return {
    id: 'system-prompt',
    chatId: '',
    role: 'system',
    content: `Eres Plutxus, un asistente de IA local y privado. Personaliza tus respuestas con este contexto del usuario: ${parts.join(
      ' '
    )}`,
    createdAt: 0,
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChatId: null,
  messagesByChat: {},
  isGenerating: false,

  loadChats: () => {
    const chats = getAllChats();
    set({ chats });
  },

  openChat: (chatId) => {
    const messages = getMessagesForChat(chatId);
    set((state) => ({
      currentChatId: chatId,
      messagesByChat: { ...state.messagesByChat, [chatId]: messages },
    }));
  },

  createNewChat: () => {
    const { activeModelId } = useAppStore.getState();
    const chat = createChat('Nuevo chat', activeModelId);
    set((state) => ({
      chats: [chat, ...state.chats],
      currentChatId: chat.id,
      messagesByChat: { ...state.messagesByChat, [chat.id]: [] },
    }));
    return chat.id;
  },

  removeChat: (chatId) => {
    deleteChatFromDb(chatId);
    set((state) => {
      const updatedMessages = { ...state.messagesByChat };
      delete updatedMessages[chatId];
      const updatedChats = state.chats.filter((c) => c.id !== chatId);
      const wasCurrent = state.currentChatId === chatId;
      return {
        chats: updatedChats,
        messagesByChat: updatedMessages,
        currentChatId: wasCurrent ? null : state.currentChatId,
      };
    });
  },

  renameCurrentChat: (chatId, title) => {
    renameChatInDb(chatId, title);
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, title } : c)),
    }));
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let chatId = get().currentChatId;
    if (!chatId) {
      chatId = get().createNewChat();
    }

    const { activeModelId } = useAppStore.getState();
    if (activeModelId) {
      setChatModel(chatId, activeModelId);
    }

    const userMessage = addMessage(chatId, 'user', trimmed);

    set((state) => {
      const isFirstMessage = (state.messagesByChat[chatId!] ?? []).length === 0;
      const newChats = isFirstMessage
        ? state.chats.map((c) =>
            c.id === chatId ? { ...c, title: trimmed.slice(0, 40) } : c
          )
        : state.chats;

      if (isFirstMessage) {
        renameChatInDb(chatId!, trimmed.slice(0, 40));
      }

      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId!]: [...(state.messagesByChat[chatId!] ?? []), userMessage],
        },
        chats: newChats,
      };
    });

    const assistantMessage = addMessage(chatId, 'assistant', '');
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId!]: [...(state.messagesByChat[chatId!] ?? []), assistantMessage],
      },
      isGenerating: true,
    }));

    const systemPrompt = buildSystemPrompt();
    const historyMessages = get().messagesByChat[chatId] ?? [];
    const conversation: ChatMessage[] = systemPrompt
      ? [systemPrompt, ...historyMessages.filter((m) => m.id !== assistantMessage.id)]
      : historyMessages.filter((m) => m.id !== assistantMessage.id);

    await generateStreamingResponse(conversation, {
      onToken: (partialText) => {
        set((state) => ({
          messagesByChat: {
            ...state.messagesByChat,
            [chatId!]: (state.messagesByChat[chatId!] ?? []).map((m) =>
              m.id === assistantMessage.id ? { ...m, content: partialText } : m
            ),
          },
        }));
      },
      onComplete: (finalText) => {
        updateMessageContent(assistantMessage.id, finalText);
        set({ isGenerating: false });
      },
      onError: (error) => {
        const errorText = `⚠️ Error: ${error.message}`;
        updateMessageContent(assistantMessage.id, errorText);
        set((state) => ({
          isGenerating: false,
          messagesByChat: {
            ...state.messagesByChat,
            [chatId!]: (state.messagesByChat[chatId!] ?? []).map((m) =>
              m.id === assistantMessage.id ? { ...m, content: errorText } : m
            ),
          },
        }));
      },
    });
  },

  stopCurrentGeneration: async () => {
    await stopGeneration();
    set({ isGenerating: false });
  },
}));

import {
  AppSettings,
  Chat,
  ChatMessage,
  DownloadedModel,
  MessageRole,
  UserProfile,
} from '../../types';

let chats: Chat[] = [];
let messages: ChatMessage[] = [];
let downloadedModels: DownloadedModel[] = [];
let profile: UserProfile = { nickname: '', occupation: '', passions: '' };
let settings: AppSettings = {
  appearance: 'dark',
  language: 'system',
  activeModelId: null,
};

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function initDatabase(): void {}

export function createChat(title: string, modelId: string | null): Chat {
  const now = Date.now();
  const chat = { id: createId(), title, modelId, createdAt: now, updatedAt: now };
  chats = [chat, ...chats];
  return chat;
}

export function getAllChats(): Chat[] {
  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getChatById(id: string): Chat | null {
  return chats.find((chat) => chat.id === id) ?? null;
}

export function renameChat(id: string, title: string): void {
  chats = chats.map((chat) =>
    chat.id === id ? { ...chat, title, updatedAt: Date.now() } : chat
  );
}

export function deleteChat(id: string): void {
  chats = chats.filter((chat) => chat.id !== id);
  messages = messages.filter((message) => message.chatId !== id);
}

export function touchChat(id: string): void {
  chats = chats.map((chat) =>
    chat.id === id ? { ...chat, updatedAt: Date.now() } : chat
  );
}

export function setChatModel(id: string, modelId: string | null): void {
  chats = chats.map((chat) => (chat.id === id ? { ...chat, modelId } : chat));
}

export function addMessage(
  chatId: string,
  role: MessageRole,
  content: string
): ChatMessage {
  const message = { id: createId(), chatId, role, content, createdAt: Date.now() };
  messages = [...messages, message];
  touchChat(chatId);
  return message;
}

export function updateMessageContent(id: string, content: string): void {
  messages = messages.map((message) => (message.id === id ? { ...message, content } : message));
}

export function getMessagesForChat(chatId: string): ChatMessage[] {
  return messages
    .filter((message) => message.chatId === chatId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function deleteMessage(id: string): void {
  messages = messages.filter((message) => message.id !== id);
}

export function getUserProfile(): UserProfile {
  return profile;
}

export function saveUserProfile(nextProfile: UserProfile): void {
  profile = nextProfile;
}

export function getAppSettings(): AppSettings {
  return settings;
}

export function saveAppSettings(nextSettings: AppSettings): void {
  settings = nextSettings;
}

export function upsertDownloadedModel(model: DownloadedModel): void {
  downloadedModels = [
    ...downloadedModels.filter((downloaded) => downloaded.id !== model.id),
    model,
  ];
}

export function getDownloadedModels(): DownloadedModel[] {
  return downloadedModels;
}

export function getDownloadedModel(id: string): DownloadedModel | null {
  return downloadedModels.find((model) => model.id === id) ?? null;
}

export function deleteDownloadedModel(id: string): void {
  downloadedModels = downloadedModels.filter((model) => model.id !== id);
}
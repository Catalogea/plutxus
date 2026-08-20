import { getDb } from './db';
import { Chat, ChatMessage, MessageRole } from '../../types';

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createChat(title: string, modelId: string | null): Chat {
  const db = getDb();
  const now = Date.now();
  const chat: Chat = { id: genId(), title, modelId, createdAt: now, updatedAt: now };
  db.runSync(
    `INSERT INTO chats (id, title, modelId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
    [chat.id, chat.title, chat.modelId, chat.createdAt, chat.updatedAt]
  );
  return chat;
}

export function getAllChats(): Chat[] {
  const db = getDb();
  return db.getAllSync<Chat>(`SELECT * FROM chats ORDER BY updatedAt DESC`);
}

export function getChatById(id: string): Chat | null {
  const db = getDb();
  return db.getFirstSync<Chat>(`SELECT * FROM chats WHERE id = ?`, [id]) ?? null;
}

export function renameChat(id: string, title: string): void {
  const db = getDb();
  db.runSync(`UPDATE chats SET title = ?, updatedAt = ? WHERE id = ?`, [
    title,
    Date.now(),
    id,
  ]);
}

export function deleteChat(id: string): void {
  const db = getDb();
  db.runSync(`DELETE FROM messages WHERE chatId = ?`, [id]);
  db.runSync(`DELETE FROM chats WHERE id = ?`, [id]);
}

export function touchChat(id: string): void {
  const db = getDb();
  db.runSync(`UPDATE chats SET updatedAt = ? WHERE id = ?`, [Date.now(), id]);
}

export function setChatModel(id: string, modelId: string | null): void {
  const db = getDb();
  db.runSync(`UPDATE chats SET modelId = ? WHERE id = ?`, [modelId, id]);
}

export function addMessage(
  chatId: string,
  role: MessageRole,
  content: string
): ChatMessage {
  const db = getDb();
  const message: ChatMessage = {
    id: genId(),
    chatId,
    role,
    content,
    createdAt: Date.now(),
  };
  db.runSync(
    `INSERT INTO messages (id, chatId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
    [message.id, message.chatId, message.role, message.content, message.createdAt]
  );
  touchChat(chatId);
  return message;
}

export function updateMessageContent(id: string, content: string): void {
  const db = getDb();
  db.runSync(`UPDATE messages SET content = ? WHERE id = ?`, [content, id]);
}

export function getMessagesForChat(chatId: string): ChatMessage[] {
  const db = getDb();
  return db.getAllSync<ChatMessage>(
    `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt ASC`,
    [chatId]
  );
}

export function deleteMessage(id: string): void {
  const db = getDb();
  db.runSync(`DELETE FROM messages WHERE id = ?`, [id]);
}

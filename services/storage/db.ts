import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync('plutxus.db');
  }
  return dbInstance;
}

export function initDatabase(): void {
  const db = getDb();
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      modelId TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      chatId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS downloaded_models (
      id TEXT PRIMARY KEY NOT NULL,
      filePath TEXT NOT NULL,
      fileName TEXT NOT NULL,
      sizeMB REAL NOT NULL,
      downloadedAt INTEGER NOT NULL,
      status TEXT NOT NULL,
      progress REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      nickname TEXT NOT NULL DEFAULT '',
      occupation TEXT NOT NULL DEFAULT '',
      passions TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      appearance TEXT NOT NULL DEFAULT 'dark',
      language TEXT NOT NULL DEFAULT 'system',
      activeModelId TEXT
    );
  `);

  // Asegurar filas únicas para profile y settings
  db.runSync(
    `INSERT OR IGNORE INTO user_profile (id, nickname, occupation, passions) VALUES (1, '', '', '')`
  );
  db.runSync(
    `INSERT OR IGNORE INTO app_settings (id, appearance, language, activeModelId) VALUES (1, 'dark', 'system', NULL)`
  );
}

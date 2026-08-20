import { getDb } from './db';
import { DownloadedModel } from '../../types';

export function upsertDownloadedModel(model: DownloadedModel): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO downloaded_models (id, filePath, fileName, sizeMB, downloadedAt, status, progress)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       filePath = excluded.filePath,
       fileName = excluded.fileName,
       sizeMB = excluded.sizeMB,
       downloadedAt = excluded.downloadedAt,
       status = excluded.status,
       progress = excluded.progress`,
    [
      model.id,
      model.filePath,
      model.fileName,
      model.sizeMB,
      model.downloadedAt,
      model.status,
      model.progress,
    ]
  );
}

export function getDownloadedModels(): DownloadedModel[] {
  const db = getDb();
  return db.getAllSync<DownloadedModel>(`SELECT * FROM downloaded_models`);
}

export function getDownloadedModel(id: string): DownloadedModel | null {
  const db = getDb();
  return (
    db.getFirstSync<DownloadedModel>(
      `SELECT * FROM downloaded_models WHERE id = ?`,
      [id]
    ) ?? null
  );
}

export function deleteDownloadedModel(id: string): void {
  const db = getDb();
  db.runSync(`DELETE FROM downloaded_models WHERE id = ?`, [id]);
}

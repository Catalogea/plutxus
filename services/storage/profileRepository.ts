import { getDb } from './db';
import { AppSettings, UserProfile } from '../../types';

export function getUserProfile(): UserProfile {
  const db = getDb();
  const row = db.getFirstSync<UserProfile>(
    `SELECT nickname, occupation, passions FROM user_profile WHERE id = 1`
  );
  return row ?? { nickname: '', occupation: '', passions: '' };
}

export function saveUserProfile(profile: UserProfile): void {
  const db = getDb();
  db.runSync(
    `UPDATE user_profile SET nickname = ?, occupation = ?, passions = ? WHERE id = 1`,
    [profile.nickname, profile.occupation, profile.passions]
  );
}

export function getAppSettings(): AppSettings {
  const db = getDb();
  const row = db.getFirstSync<AppSettings>(
    `SELECT appearance, language, activeModelId FROM app_settings WHERE id = 1`
  );
  return (
    row ?? { appearance: 'dark', language: 'system', activeModelId: null }
  );
}

export function saveAppSettings(settings: AppSettings): void {
  const db = getDb();
  db.runSync(
    `UPDATE app_settings SET appearance = ?, language = ?, activeModelId = ? WHERE id = 1`,
    [settings.appearance, settings.language, settings.activeModelId]
  );
}

import Database from "better-sqlite3";

const db = new Database("database.sqlite");

db.prepare(`
CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at INTEGER
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS scheduled_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel TEXT,
    text TEXT,
    send_time INTEGER
)`).run();

export default db;

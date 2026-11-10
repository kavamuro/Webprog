import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const db = new Database("./data/database.sqlite");

db.prepare(`
  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    imageUrl TEXT NOT NULL,
    description TEXT
  )
`).run;

export default db; 
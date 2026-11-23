import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "agent.sqlite");

console.log(`Database path: ${DB_PATH}`);

const db = new Database(DB_PATH);

db.prepare(
  `CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    imageUrl TEXT NOT NULL,
    description TEXT
  )`,
).run();

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    passwordHash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    tokenHash TEXT PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiresAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS uploads (
    filename TEXT PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );
`);


const agentColumns = db.pragma("table_info(agents)").map((c) => c.name);
if (!agentColumns.includes("userId")) {
  db.exec(
    "ALTER TABLE agents ADD COLUMN userId INTEGER REFERENCES users(id) ON DELETE CASCADE",
  );
}
if (!agentColumns.includes("isPublic")) {
  db.exec("ALTER TABLE agents ADD COLUMN isPublic INTEGER NOT NULL DEFAULT 1");
}

if (!agentColumns.includes("apiId")) {
  db.exec("ALTER TABLE agents ADD COLUMN apiId TEXT");

  const setApiId = db.prepare("UPDATE agents SET apiId = ? WHERE id = ?");
  const IMAGE_URL = "https://media.valorant-api.com/agents/";
  const used = new Set();
  for (const { id, imageUrl } of db
    .prepare("SELECT id, imageUrl FROM agents WHERE userId IS NULL ORDER BY id")
    .all()) {
    const apiId = imageUrl.startsWith(IMAGE_URL)
      ? imageUrl.slice(IMAGE_URL.length).split("/")[0]
      : null;
    if (apiId && !used.has(apiId)) {
      used.add(apiId);
      setApiId.run(apiId, id);
    }
  }
}
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS agents_apiId ON agents(apiId)");

console.log("Database ready.");

const API_URL = "https://valorant-api.com/v1/agents?isPlayableCharacter=true";


export async function syncAgents() {
  console.log("Syncing agents with the Valorant API...");

  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`API responded with status ${res.status}`);

    const { data } = await res.json();

    const update = db.prepare(
      "UPDATE agents SET name = ?, role = ?, imageUrl = ?, description = ? WHERE apiId = ?",
    );
    const insert = db.prepare(
      "INSERT INTO agents (name, role, imageUrl, description, apiId) VALUES (?, ?, ?, ?, ?)",
    );

    const saveAll = db.transaction((agents) => {
      for (const agent of agents) {
        const imageUrl = agent.fullPortrait ?? agent.displayIcon;
        if (!agent.uuid || !agent.displayName || !imageUrl) continue;
        const values = [
          agent.displayName,
          agent.role?.displayName ?? null,
          imageUrl,
          agent.description ?? null,
          agent.uuid,
        ];
        if (update.run(values).changes === 0) insert.run(values);
      }
    });

    saveAll(data);
    console.log(`Synced ${data.length} official agents.`);
  } catch (err) {
    console.error("Sync failed:", err.message);
    console.error("The app will still run with the agents it already has.");
  }
}

export default db;

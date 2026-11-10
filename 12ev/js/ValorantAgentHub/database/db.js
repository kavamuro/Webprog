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
  )`
).run();
 
console.log("Database ready.");

const API_URL = "https://valorant-api.com/v1/agents?isPlayableCharacter=true";
 
export async function seedAgents() {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM agents").get();
 
  if (count > 0) {
    console.log(`Database already has ${count} agents — skipping seed.`);
    return;
  }
 
  console.log("Database is empty. Fetching agents from Valorant API...");
 
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API responded with status ${res.status}`);
 
    const { data } = await res.json();
 
    const insert = db.prepare(
      "INSERT INTO agents (name, role, imageUrl, description) VALUES (?, ?, ?, ?)"
    );
 
    const insertAll = db.transaction((agents) => {
      for (const agent of agents) {
        insert.run(
          agent.displayName,
          agent.role?.displayName ?? null,
          agent.fullPortrait ?? agent.displayIcon,
          agent.description ?? null
        );
      }
    });
 
    insertAll(data);
    console.log(`Seeded ${data.length} agents successfully.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    console.error("The app will still run — you can add agents manually.");
  }
}
 
export default db;

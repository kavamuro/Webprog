import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    origin TEXT

    )
    `,
).run();

export const getAllActors = () =>
  db
    .prepare(
      `
    SELECT * FROM actors
    `,
    )
    .all();

export const getActorById = (id) =>
  db
    .prepare(
      `
    SELECT * FROM actors WHERE id = ?
    `,
    )
    .get(id);

export const saveComment = (actor, origin) =>
  db
    .prepare(
      `
    INSERT INTO actors (name,origin) VALUES (?,?)
    `,
    )
    .run(actor, origin);
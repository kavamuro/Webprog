import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    message TEXT

    )
    `,
).run();

export const saveComment = (author, message) =>
  db
    .prepare(
      `
    INSERT INTO comments (author,message) VALUES (?,?)
    `,
    )
    .run(author, message);

export const getAllComments = () =>
  db
    .prepare(
      `
    SELECT * FROM comments
    `,
    )
    .all();

export const getCommentById = (id) =>
  db
    .prepare(
      `
    SELECT * FROM comments WHERE id = ?
    `,
    )
    .get(id);

export const updateComment = (id, author, message) =>
  db
    .prepare(`UPDATE comments SET author = ?, message = ? WHERE id = ?`)
    .run(author, message, id);

export const deleteComment = (id) =>
  db.prepare(`DELETE FROM comments WHERE id = ?`).run(id);

const { commentNumber } = db
  .prepare(`SELECT COUNT(*) AS commentNumber FROM comments`)
  .get();

if (commentNumber == 0) {
  saveComment("Triple T", "Fire brochachino");
  saveComment("Patapim", "Banger");
  saveComment("Mel'aviv", "It was promised to me 2000 years ago");
  saveComment("Toldi", "I do this for my gang");
  saveComment("El cinco", "What did you did to el quatro!?");
}

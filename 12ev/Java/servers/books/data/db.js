import Database from "better-sqlite3";

const db = new Database("./data/adazbazis.db");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author STRING,
    title STRING,
    year INTEGER)
    `,
).run();

export function getAllBooks() {
  return db.prepare(`SELECT * FROM books`);
}

export function getBookById() {
  return db.prepare(`SELECT * FROM books WHERE id = ?`).get();
}

export function createBook(author, title, year) {
  return db
    .prepare(`INSERT INTO books (author, title, year) VALUES (?,?,?)`)
    .run(author, title, year);
}

// export const getAllBooks=() => db.prepare(`SELECT * FROM books`);

export default db;

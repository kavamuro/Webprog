import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT

    )
    `,
).run();

export function getAllPosts(){
    return db.prepare(`SELECT * FROM posts`).all()
}
export function getPostById(){
    return db.prepare(`SELECT * FROM posts WHERE id = ?`).get()
}

export const savePosts = (title,content) =>
  db
    .prepare(
      `
    INSERT INTO title (title ,content) VALUES (?,?)
    `,
    )
    .run(title,content);


export const deletePosts = (id) =>
  db.prepare(`DELETE FROM title WHERE id = ?`).run(id);

const { postsNumber } = db
  .prepare(`SELECT COUNT(*) AS commentNumber FROM title`)
  .get();

if (postsNumber ) {
}






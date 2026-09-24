import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name STRING
    )
    `,
).run();

export const getAllStudents = () =>
  db
    .prepare(
      `
    SELECT * FROM students
    `,
    )
    .all();

export const getStudentById = (id) =>
  db
    .prepare(
      `
    SELECT * FROM students WHERE id = ?
    `,
    )
    .get(id);

export const saveStudent = (name) =>
  db
    .prepare(
      `
    INSERT INTO students (name) VALUES (?)
    `,
    )
    .run(name);

export const updateStudent = (id, name) =>
  db.prepare(`UPDATE students SET name = ? WHERE id = ?`).run(name, id);

export const deleteStudent = (id) =>
  db.prepare(`DELETE FROM students WHERE id = ?`).run(id);

const { studentsNumber } = db
  .prepare(`SELECT COUNT(*) AS studentsNumber FROM students`)
  .get();

if (studentsNumber == 0) {
  saveStudent("Ann");
  saveStudent("Zoe");
  saveStudent("Cloe");
  saveStudent("Mia");
}
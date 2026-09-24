import Database from "better-sqlite3";

const db = new Database("./data/database.db");

db.prepare(
  `
        CREATE TABLE IF NOT EXISTS cars(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT,
        brand TEXT,
        year INTEGER
        )
    `,
).run();

export const getCarByBrand = (brand) =>
  db.prepare("SELECT * FROM cars where brand = ?").get(brand);

export const getCarByYear = (year) =>
  db.prepare("SELECT * FROM cars where year = ?").get(year);

export const createCar = (model, brand, year) =>
  db
    .prepare("INSTERT INTO cars (model,brand,year) VALUES (?,?,?)")
    .run(model, brand, year);

export const updateCar = (id, model, brand, year) =>
  db
    .prepare("UPDATE cars SET model = ?,brand = ?, year = ? WHERE id = ?")
    .run(model, brand, year, id);

export const deleteCar = (id) =>
  db.prepare(`DELETE FROM cars WHERE id = ?`).run(id);
export default db;

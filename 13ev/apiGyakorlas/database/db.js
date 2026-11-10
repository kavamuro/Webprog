import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const db = new Database("./office.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS office_supplies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    location TEXT NOT NULL,
    active INTEGER NOT NULL CHECK (active IN (0, 1))
  )
`,
).run();

const count = db
  .prepare("SELECT COUNT(*) AS count FROM office_supplies")
  .get().count;

if (count === 0) {
  const csvPath = path.resolve("adatok.csv");

  if (fs.existsSync(csvPath)) {
    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const lines = fileContent.trim().split(/\r?\n/);

    const insertStmt = db.prepare(`
      INSERT INTO office_supplies (id, name, category, brand, price, stock, location, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTransaction = db.transaction((rows) => {
      for (const line of rows) {
        if (!line.trim()) continue;
        const [id, name, category, brand, price, stock, location, active] =
          line.split(",");

        insertStmt.run(
          Number(id),
          name.trim(),
          category.trim(),
          brand.trim(),
          Number(price),
          Number(stock),
          location.trim(),
          Number(active),
        );
      }
    });

    insertTransaction(dataLines);
  }
}

export const getAllSupplies = () =>
  db.prepare("SELECT * FROM office_supplies").all();

export const getSupplyById = (id) =>
  db.prepare("SELECT * FROM office_supplies WHERE id = ?").get(id);

export const searchSupplies = (filters) => {
  let query = "SELECT * FROM office_supplies WHERE 1=1";
  const params = [];

  if (filters.category) {
    query += " AND category = ?";
    params.push(filters.category);
  }
  if (filters.brand) {
    query += " AND brand = ?";
    params.push(filters.brand);
  }
  if (filters.location) {
    query += " AND location = ?";
    params.push(filters.location);
  }
  if (filters.active !== undefined) {
    query += " AND active = ?";
    params.push(Number(filters.active));
  }
  if (filters.name) {
    query += " AND name LIKE ?";
    params.push(`%${filters.name}%`);
  }

  return db.prepare(query).all(...params);
};

export const createSupply = (
  name,
  category,
  brand,
  price,
  stock,
  location,
  active,
) =>
  db
    .prepare(
      "INSERT INTO office_supplies (name, category, brand, price, stock, location, active) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(name, category, brand, price, stock, location, active);

export const updateSupply = (
  id,
  name,
  category,
  brand,
  price,
  stock,
  location,
  active,
) =>
  db
    .prepare(
      "UPDATE office_supplies SET name = ?, category = ?, brand = ?, price = ?, stock = ?, location = ?, active = ? WHERE id = ?",
    )
    .run(name, category, brand, price, stock, location, active, id);

export const deleteSupply = (id) =>
  db.prepare("DELETE FROM office_supplies WHERE id = ?").run(id);

export const getStats = () => {
  const summary = db
    .prepare(
      `SELECT 
        COUNT(*) AS total_items, 
        SUM(stock) AS total_stock, 
        SUM(price * stock) AS total_value, 
        ROUND(AVG(price), 2) AS average_price 
       FROM office_supplies`,
    )
    .get();

  const byCategory = db
    .prepare(
      `SELECT category, COUNT(*) AS count, SUM(stock) AS total_stock 
       FROM office_supplies 
       GROUP BY category`,
    )
    .all();

  return { summary, byCategory };
};

export default db;

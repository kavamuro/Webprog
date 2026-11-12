import Database from "better-sqlite3";

const db = new Database("./data/sports.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS equipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
  )
`,
).run();

export const getEquipmentById = (id) =>
  db.prepare("SELECT * FROM equipments WHERE id = ?").get(id);

export const getEquipmentsByCategory = (category) =>
  db.prepare("SELECT * FROM equipments WHERE category = ?").all(category);

export const updateEquipment = (
  id,
  { name, category, brand, price, quantity },
) => {
  const result = db
    .prepare(
      `UPDATE equipments
       SET name = ?, category = ?, brand = ?, price = ?, quantity = ?
       WHERE id = ?`,
    )
    .run(name, category, brand, price, quantity, id);

  if (result.changes === 0) {
    return null;
  }

  return getEquipmentById(id);
};

export const deleteEquipment = (id) => {
  const result = db.prepare("DELETE FROM equipments WHERE id = ?").run(id);
  return result.changes > 0;
};

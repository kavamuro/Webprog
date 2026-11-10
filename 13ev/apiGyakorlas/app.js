import express from "express";
import * as db from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

const validateSupply = (body) => {
  const { name, category, brand, price, stock, location, active } = body;

  if (!name || !category || !brand || !location) {
    return "Minden mező kitöltése kötelező!";
  }
  if (typeof price !== "number" || price <= 0) {
    return "A price mező értéke pozitív szám kell legyen!";
  }
  if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
    return "A stock mező értéke 0 vagy pozitív egész szám kell legyen!";
  }
  if (active !== 0 && active !== 1) {
    return "Az active mező értéke kizárólag 0 vagy 1 lehet!";
  }
  return null;
};

app.get("/api/supplies", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    const filteredSupplies = db.searchSupplies(req.query);
    return res.status(200).json(filteredSupplies);
  }

  const supplies = db.getAllSupplies();
  res.status(200).json(supplies);
});

app.get("/api/supplies/stats", (req, res) => {
  const stats = db.getStats();
  res.status(200).json(stats);
});

app.get("/api/supplies/:id", (req, res) => {
  const id = +req.params.id;
  const supply = db.getSupplyById(id);

  if (!supply) {
    return res.status(404).json({ message: "Az eszköz nem található." });
  }

  res.status(200).json(supply);
});

app.post("/api/supplies", (req, res) => {
  const error = validateSupply(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { name, category, brand, price, stock, location, active } = req.body;
  const result = db.createSupply(
    name,
    category,
    brand,
    price,
    stock,
    location,
    active,
  );
  const createdSupply = db.getSupplyById(result.lastInsertRowid);

  res.status(201).json(createdSupply);
});

app.put("/api/supplies/:id", (req, res) => {
  const id = +req.params.id;
  const supply = db.getSupplyById(id);

  if (!supply) {
    return res.status(404).json({ message: "Az eszköz nem található." });
  }

  const error = validateSupply(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { name, category, brand, price, stock, location, active } = req.body;
  db.updateSupply(id, name, category, brand, price, stock, location, active);

  const updatedSupply = db.getSupplyById(id);
  res.status(200).json(updatedSupply);
});

app.delete("/api/supplies/:id", (req, res) => {
  const id = +req.params.id;
  const result = db.deleteSupply(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Az eszköz nem található." });
  }

  res.status(200).json({ message: "Az eszköz sikeresen törölve." });
});

app.listen(PORT, () => {
  console.log(`Server runs on ${PORT}\nAccess path: http://localhost:${PORT}`);
});

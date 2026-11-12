import express from "express";
import * as db from "./data/db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/equipment/category/:category", (req, res) => {
  const equipments = db.getEquipmentsByCategory(req.params.category);
  if (equipments.length === 0) {
    return res
      .status(404)
      .json({ message: "No equipment found in this category." });
  }
  res.status(200).json(equipments);
});

app.get("/api/equipment/:id", (req, res) => {
  const equipment = db.getEquipmentById(+req.params.id);
  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found." });
  }
  res.status(200).json(equipment);
});

app.put("/api/equipment/:id", (req, res) => {
  const id = +req.params.id;
  if (!db.getEquipmentById(id)) {
    return res.status(404).json({ message: "Equipment not found." });
  }
  const { name, category, brand, price, quantity } = req.body || {};
  const isValid =
    typeof name === "string" &&
    name.trim() !== "" &&
    typeof category === "string" &&
    category.trim() !== "" &&
    typeof brand === "string" &&
    brand.trim() !== "" &&
    typeof price === "number";

  if (!isValid) {
    return res.status(404).json({ Message: "The input data is not valid!" });
  }
  db.updateEquipment(
    id,
    name.trim(),
    category.trim(),
    brand.trim(),
    price,
    quantity,
  );
  res.status(200).json(db.getEquipmentById(id));
});

app.delete("/api/equipment/:id", (req, res) => {
  const id = +req.params.id;

  const deleted = db.deleteEquipment(id);
  if (!deleted) {
    return res.status(404).json({ message: "Equipment not found." });
  }

  return res.status(200).json({ message: "Equipment successfully deleted." });
});

app.listen(PORT, () => {
  console.log(`Server runs on ${PORT}\nAccess path: http://localhost:${PORT}`);
});

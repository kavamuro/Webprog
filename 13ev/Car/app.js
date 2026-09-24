import express from "express";
import * as db from "./data/db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/cars/brand/:brand", (req, res) => {
  const brand = req.params.brand;
  const cars = db.getCarByBrand(brand);
  if (!cars) {
    res.status(404).json({ Message: "Fill out the brand!" });
  }

  res.status(200).json(cars);
});
app.get("/api/cars/brand/:year", (req, res) => {
  const year = +req.params.year;
  const cars = db.getCarByYear(year);

  if (!cars) {
    res.status(404).json({ Message: "Fill out the brand!" });
  }

  res.status(200).json(cars);
});
app.post("/api/cars", (req, res) => {
  const { model, brand, year } = req.body;
  if (!brand || !model || !year) {
    return res
      .status(400)
      .json({ message: "Brand, model and year are required!" });
  }
  const saved = db.createCar(model, brand, year);

  res.status(201).json({ Message: "Car is saved" });
});
app.put("/api/cars/:id", (req, res) => {
  const id = +req.params.id;
  const { model, brand, year } = req.body;

  if (!brand || !model || !year) {
    return res
      .status(400)
      .json({ message: "Brand, model and year are required!" });
  }

  const update = db.updateCar(id, model, brand, year);

  if (update.changes === 0) {
    return res.status(404).json({ message: "Car not found!" });
  }

  res.status(200).json({ message: "Update successful!" });
});

app.delete("/api/cars/:id", (req, res) => {
  const id = +req.params.id;

  const result = db.deleteCar(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Car not found!" });
  }

  res.status(200).json({ message: "Delete successful!" });
});

app.listen(PORT, () => {
  console.log(`Server runs on ${PORT}\nAccess path: http://localhost:${PORT}`);
});

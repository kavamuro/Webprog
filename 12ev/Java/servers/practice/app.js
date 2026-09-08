import express from "express";
import * as db from "./data/db.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/cars", (req, res) => {
  const cars = db.getAllCars();
  res.status(200).json(cars);
});

app.get("/cars/:id", (req, res) => {
  const car = db.getCarsById(+req.params.id);
  if (!car) {
    res.status(404).json({ message: "No car found with this ID" });
  }
  res.status(200).json(car);
});

app.post("/cars", (req, res) => {
  const { brand, model, year } = req.body;
  if (!brand || !model || !year) {
    return res
      .status(400)
      .json({ message: "Brand, model and year are required!" });
  }
  const saved = db.createCars(brand, model, year);
  const car = db.getCarsById(saved.lastInsertRowid);
  res.status(201).json(car);
});
app.put("/cars/:id", (req, res) => {
  const id = +req.params.id;
  const { brand, model, year } = req.body;
  const car = db.getCarsById(id);
  if (!car) {
    return res.status(404).json({ message: "Car not found!" });
  }
  if (!brand || !model || !year) {
    return res
      .status(400)
      .json({ message: "Brand, model and year are required!" });
  }
  db.updateCar(id, brand, model, year);
  res.status(200).json({ message: "Update successful!" });
});
app.delete("/cars/:id", (req, res) => {
  const id = +req.params.id;
  const car = db.getCarsById(id);
  if (!car) {
    return res.status(404).json({ message: "Car not found!" });
  }
  db.deleteCar(id);
  res.status(200).json({ message: "Delete successful!" });
});

app.listen(PORT, () => {
  console.log("Runs");
});

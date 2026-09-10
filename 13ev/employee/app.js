import express from "express";
import * as db from "./database/db.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/employees", (req, res) => {
  const employee = db.getAllEmployees();
  res.status(200).json(employee);
});

(app.get("/employees/:id"),
  (req, res) => {
    const employee = db.getEmployeesById(+req.params.id);
    if (!employee) {
      res.status(404).json({ message: "No Employee found with this ID" });
    }
    res.status(200).json(employee);
  });
app.post("/employees", (req, res) => {
  const {
    company,
    lastname,
    firstname,
    position,
    salary,
    department,
    gender,
    holiday_days,
    birth_date,
  } = req.body;

  if (
    !company ||
    !lastname ||
    !firstname ||
    !position ||
    !salary ||
    !department ||
    !gender ||
    !holiday_days ||
    !birth_date
  ) {
    res.status(400).json({ message: "All employee fields are required!" });
  } else {
    const saved = db.createEmployee(
      company,
      lastname,
      firstname,
      position,
      salary,
      department,
      gender,
      holiday_days,
      birth_date,
    );

    res.status(201).json(saved);
  }
});

app.put("/employees/:id", (req, res) => {
  const id = +req.params.id;
  const {
    company,
    lastname,
    firstname,
    position,
    salary,
    department,
    gender,
    holiday_days,
    birth_date,
  } = req.body;

  const employee = db.getEmployeeById(id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found!" });
  }

  if (
    !company ||
    !lastname ||
    !firstname ||
    !position ||
    !salary ||
    !department ||
    !gender ||
    !holiday_days ||
    !birth_date
  ) {
    return res
      .status(400)
      .json({ message: "All employee fields are required!" });
  }

  db.updateEmployee(
    id,
    company,
    lastname,
    firstname,
    position,
    salary,
    department,
    gender,
    holiday_days,
    birth_date,
  );

  res.status(200).json({ message: "Update successful!" });
});

app.delete("/employees/:id", (req, res) => {
  const id = +req.params.id;
  const employee = db.getCarsById(id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found!" });
  }
  db.deleteEmployees(id);
  res.status(200).json({ message: "Delete successful!" });
});

app.listen(PORT, () =>
  console.log(`Server runs on ${PORT}\nAccess path: http://localhost:${PORT}`),
);

import express from 'express'
import * as db from "./data/db.js"

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/students", (req, res) => {
  const students = db.getAllStudents();
  res.status(200).json(students);
});

app.get("/students/:id", (req, res) => {
  const student = db.getStudentById(+req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.status(200).json(student);
});

app.post("/students", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const saved = db.saveStudent(name);
  const student = db.getStudentById(saved.lastInsertRowid)
  res.status(201).json({ id: saved.lastInsertRowid, name });
});

app.put('/students/:id', (req, res) => {
  const id = +req.params.id
  const student = db.getStudentById(id)
  if (!student) {
    return res.status(404).json({message: 'Student not found'})
  }
  const name = req.body.name
  if (!name) {
    return res.status(400).json({message: "Name is required"})
  }
  db.updateStudent(id, name)
  res.status(200).json({message: "Update success", id, name})
})
app.delete('/students/:id', (req, res) => {
  const id = +req.params.id
  const student = db.getStudentById(id)
  if (!student) {
    return res.status(404).json({message: 'Student not found'})
  }
  db.deleteStudent(id)
  res.status(200).json({message: "Delete success"})
})

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
import express from "express";

const PORT = 3030;
const app = express();

const students = [
  { id: 1, name: "Ann", subject: "maths" },
  { id: 2, name: "Bob", subject: "IT" },
  { id: 3, name: "Cloe", subject: "PE" },
];

app.use(express.json());

app.get("/students/:id", (req, res) => {
  const id = +req.params.id;
  const student = students.find((x) => x.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found!" });
  }
  res.status(200).json(student);
});

app.post("/students", (req, res) => {
  const { name, subject } = req.body;
  if (!name || !subject) {
    return res.status(404).json({ message: "Name and subject are required" });
  }
  const id = students[students.length - 1]?.id + 1;
  const student = { id, name, subject };
  students.push(student);
  res.status(201).json(student);
});

app.put("/student/:id", (req, res) => {
  const id = +req.params.id;
  const student = students.find((x) => x.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found!" });
  }
  const { name, subject } = req.body;
  if (!name || !subject) {
    return res.status(404).json({ message: "Name and subject are required" });
  }
  student.name = name;
  student.subject = subject;
  res.status(200).json(student);
});

app.listen(PORT, () => {
  console.log(`Server running at port: http://localhost:${PORT}`);
});

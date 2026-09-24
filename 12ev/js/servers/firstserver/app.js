import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const user = { firstname: "Adam", lastname: "Sandler" };
  res.json({ message: "TUNG TUNG TUNG SAHUR", number: 7, user });
});

// app.post('/', (req, res) => {});
// app.put('/', (req, res) => {});
// app.patch('/', (req, res) => {});
// app.delete('/', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});

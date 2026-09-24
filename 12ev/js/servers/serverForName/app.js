import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const user = { firstname: "Patrik", lastname: "Maksa", class: "12.B" };
  res.json({ user: user });
});

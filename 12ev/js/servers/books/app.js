import express from "express";
import * as db from "./data/db.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/books", (req, res) => {
  const books = db.getAllBooks();
  res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
  const book = db.getBookById(+req.params.id);
  if (!book) {
    res.status(404).json({ message: "NIncs ilyen konyv ID" });
  }
  res.status(200).json(book);
});

app.post("/books", (req, res) =>{
  const {author, title, year} = req.body;
  if(!author || !title || !year)
  { return res.status(400).json({message: "Auther, title and year are required!"})}
  const saved = db.createBook(author, title, year)
  const book = db.getBookById(saved.lastInsertRowid)
  res.status(201).json({id: saved.lastInsertRowid, book})
})


app.listen(PORT, () => {
  console.log("Runs");
});

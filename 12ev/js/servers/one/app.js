import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));

let books = [
  { id: 1, author: "Pump Lil", title: "Gang gucci" },
  { id: 2, author: "Lil pump", title: "Gucci Gang" },
  { id: 3, author: "Alan walker", title: "PUcci viato" },
];

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const id = +req.params.id;
  const book = books.find((x) => x.id == id);
  if (!book) {
    return res.status(404).json({ message: "Book not found!" });
  }
  res.status(200).json(book);
});

app.post("/books", (req, res) => {
  const { author, title } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required!" });
  }
  const nextId = books[books.length - 1]?.id + 1 || 0 + 1;
  const book = { id: nextId, author, title };
  books.push(book);
  res.status(200).json(book);
});

app.put("/books/:id", (req, res) => {
  const id = +req.params.id;
  const book = books.find((x) => x.id === id);
  if (!book) {
    return res.status(404).json({ message: "book not found!" });
  }
  const name = req.body;
  book.name = name;
  res.status(200).json(book);
});

app.delete("/books/:id", (req, res) => {
  const id = +req.params.id;
  const book = books.filter((x) => x.id === id);
  if (!book) {
    return res.status(404).json({ message: "Id not found!" });
  }
  res.status(200).json({ message: "Delete was successful!" });
});

app.listen(PORT, () => {
  console.log(` Server runs on port ${PORT}`);
});

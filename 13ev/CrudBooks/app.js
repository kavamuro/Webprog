const express = require("express");
const app = express();
const PORT = 3000;

const books = [
  {
    id: 1,
    title: "A Gyűrűk Ura",
    author: "J.R.R. Tolkien",
    year: 1954,
    genre: "Fantasy",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "Dystopian",
  },
  {
    id: 3,
    title: "A Pál utcai fiúk",
    author: "Molnár Ferenc",
    year: 1906,
    genre: "Ifjúsági regény",
  },
  {
    id: 4,
    title: "Egri csillagok",
    author: "Gárdonyi Géza",
    year: 1899,
    genre: "Történelmi regény",
  },
  {
    id: 5,
    title: "Dűne",
    author: "Frank Herbert",
    year: 1965,
    genre: "Sci-Fi",
  },
  {
    id: 6,
    title: "Harry Potter és a bölcsek köve",
    author: "J.K. Rowling",
    year: 1997,
    genre: "Fantasy",
  },
];

app.get("/books", (req, res) => {
  if (!books) return res.status(404).json({ Message: "Books not found!" });
  return res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
  const id = +req.params.id;
  const book = books.find((b) => b.id == id);
  if (!book) return res.status(404).json({ Message: "Book not found!" });
  res.status(200).json(book);
});

app.post("/books", (req, res) => {
  const lastBook = books.at(-1);
  const newId = lastBook ? lastBook.id + 1 : 1;
  const { title, author, year, genre } = req.body;
  if (!title || !author || !year || !genre) {
    return res
      .status(400)
      .json({ error: "Author, Title, year and genre are required" });
  }

  const newBook = {
    id: newId,
    title,
    author,
    year,
    genre,
  };

  books.push(newBook);
  return res.status(201).json(newBook);
});

app.put("/api/books/:id", (req, res) => {
  const id = +req.params.id;
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ Message: "Book not found!" });
  }
  const { title, author, year, genre } = req.body;
  if (!title || !author || !year || !genre) {
    return res
      .status(400)
      .json({ error: "Author, Title, year and genre are required" });
  }
  books[bookIndex] = {
    id,
    title,
    author,
    year,
    genre,
  };

  res.status(200).json(books[bookIndex]);
});


app.delete("/books/:id", (req, res) => {
  const id = +req.params.id;
  const book = books.findIndex((b) => b.id == id);
  if (!book <= -1) return res.status(404).json({ Message: "Book not found!" });
  books.splice(book, 1);
  res.status(200).json({ Message: "Book deleted successfully!" });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

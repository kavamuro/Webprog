const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "books",
});

connection.connect((err) => {
  if (err) {
    throw err;
    console.log(err);
  }
});

const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/allBooks", (req, res) => {
  connection.query("SELECT * FROM books", (err, queryResult) => {
    if (err) {
      return res.status(500).json({ error: "Hiba az adatbázis elérésekor" });
    }
    return res.status(200).json(queryResult);
  });
});

app.get("/books/:id", (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Az ID-nak számnak kell lennie!" });
  }

  connection.query("SELECT * FROM books WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Adatbázis hiba történt!" });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "A megadott ID-val nem található könyv!" });
    }
    return res.status(200).json(result[0]);
  });
});

app.post("/books", (req, res) => {
  const { title, author, year, genre } = req.body;

  if (!title || !author || !year || !genre) {
    return res
      .status(400)
      .json({ error: "A cím, szerző, kiadási év és műfaj megadása kötelező!" });
  }

  const newBook = { title, author, year, genre };

  connection.query("INSERT INTO books SET ?", newBook, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Adatbázis hiba történt a mentés során!" });
    }
    return res.status(201).json({
      message: "Könyv sikeresen elmentve!",
      insertedId: result.insertId,
      ...newBook,
    });
  });
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Az ID-nak számnak kell lennie!" });
  }

  connection.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Adatbázis hiba történt a törlés során!" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "A megadott ID-val nem található törölhető könyv!" });
    }
    return res.status(200).json({ message: "Könyv sikeresen törölve!" });
  });
});

app.get("/books/after/:year", (req, res) => {
  const year = req.params.year;

  if (isNaN(year)) {
    return res.status(400).json({ error: "Az évszámnak számnak kell lennie!" });
  }

  connection.query(
    "SELECT * FROM books WHERE CAST(year AS UNSIGNED) > ?",
    [Number(year)],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Adatbázis hiba történt!" });
      }
      return res.status(200).json(result);
    },
  );
});

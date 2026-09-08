import express from "express";
import * as db from "./data/db.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/comments", (req, res) => {
  const comments = db.getAllComments();
  res.status(200).json(comments);
});

app.get("/comments/:id", (req, res) => {
  const comment = db.getCommentById(+req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  res.status(200).json(comment);
});

app.post("/comments", (req, res) => {
  const author = req.body.author;
  const message = req.body.message;
  if (!author || !message) {
    return res.status(404).json({ message: "Author/ message is required" });
  }
  const saved = db.saveComment(author, message);
  res.status(201).json({ id: saved.lastInsertRowid, author });
});

app.put("/comments/:id", (req, res) => {
  const id = +req.params.id;
  let comment = db.getCommentById(id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const author = req.body.author;
  const message = req.body.message;
  if (!author || !message) {
    return res.status(404).json({ message: "Author/ message is required" });
  }
  db.updateComment(id, author, message);
  res.status(200).json({ id, author, message });
});

app.delete("/comments/:id", (req, res) => {
  const id = +req.params.id;
  const comment = db.getCommentById(id);
  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }
  db.deleteComment(id);
  res.status(204).json({ message: "Delete success" });
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));

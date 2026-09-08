import express from "express";
import * as db from "./data/db.js";

const PORT = 3333;
const app = express();

app.get('/actors', (req,res) =>{
    const actors = db.getAllActors();
     res.status(200).json(actors);
})

app.get('/actors/:id', (req,res) =>{
    const actors = db.getActorById();
     res.status(200).json(actors);
})

app.get("/actors/:id", (req, res) => {
  const actor = db.getCommentById(+req.params.id);
  if (!actor) {
    return res.status(404).json({ message: "Actor not found" });
  }
  res.status(200).json(actor);
})


app.post("/actors", (req,res) =>{
    const actor = req.body.name;
    const origin = req.body.origin;
    if(!actor || !origin)
    { res.status(400).json({message: "Name and Origin is required!"})}
    const saved = db.saveActor(actor, origin);
  res.status(201).json({ id: saved.lastInsertRowid, actor })
})
app.listen(PORT, () => console.log(`Server runs on ${PORT}`))
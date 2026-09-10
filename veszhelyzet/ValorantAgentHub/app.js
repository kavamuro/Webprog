import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db, { seedAgents } from "./database/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT, time: new Date().toISOString() });
});

app.get("/agents", (req, res) => {
  try {
    const agents = db.prepare("SELECT * FROM agents ORDER BY name ASC").all();
    console.log(`GET /agents → ${agents.length} agents`);
    res.json(agents);
  } catch (err) {
    console.error("GET /agents error:", err.message);
    res.status(500).json({ error: "Failed to retrieve agents." });
  }
});

app.get("/agents/:id", (req, res) => {
  try {
    const agent = db
      .prepare("SELECT * FROM agents WHERE id = ?")
      .get(req.params.id);
    if (!agent) return res.status(404).json({ error: "Agent not found." });
    res.json(agent);
  } catch (err) {
    console.error("GET /agents/:id error:", err.message);
    res.status(500).json({ error: "Failed to retrieve agent." });
  }
});

app.post("/agents", (req, res) => {
  console.log("POST /agents body:", req.body);
  const { name, role, imageUrl, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Agent name is required." });
  }
  if (!imageUrl || !imageUrl.trim()) {
    return res.status(400).json({ error: "Image URL is required." });
  }

  try {
    const result = db
      .prepare(
        "INSERT INTO agents (name, role, imageUrl, description) VALUES (?, ?, ?, ?)",
      )
      .run(
        name.trim(),
        role?.trim() || null,
        imageUrl.trim(),
        description?.trim() || null,
      );

    const newAgent = db
      .prepare("SELECT * FROM agents WHERE id = ?")
      .get(result.lastInsertRowid);
    console.log(
      `POST /agents → Created agent: ${newAgent.name} (id: ${newAgent.id})`,
    );
    res.status(201).json(newAgent);
  } catch (err) {
    console.error("POST /agents error:", err.message);
    res.status(500).json({ error: "Failed to add agent." });
  }
});

app.put("/agents/:id", (req, res) => {
  const { name, role, imageUrl, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Agent name is required." });
  }
  if (!imageUrl || !imageUrl.trim()) {
    return res.status(400).json({ error: "Image URL is required." });
  }

  try {
    const existing = db
      .prepare("SELECT * FROM agents WHERE id = ?")
      .get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Agent not found." });

    db.prepare(
      "UPDATE agents SET name = ?, role = ?, imageUrl = ?, description = ? WHERE id = ?",
    ).run(
      name.trim(),
      role?.trim() || null,
      imageUrl.trim(),
      description?.trim() || null,
      req.params.id,
    );

    const updated = db
      .prepare("SELECT * FROM agents WHERE id = ?")
      .get(req.params.id);
    console.log(`PUT /agents/${req.params.id} → Updated: ${updated.name}`);
    res.json(updated);
  } catch (err) {
    console.error("PUT /agents/:id error:", err.message);
    res.status(500).json({ error: "Failed to update agent." });
  }
});

app.delete("/agents/:id", (req, res) => {
  try {
    const existing = db
      .prepare("SELECT * FROM agents WHERE id = ?")
      .get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Agent not found." });

    db.prepare("DELETE FROM agents WHERE id = ?").run(req.params.id);
    console.log(`DELETE /agents/${req.params.id} → Deleted: ${existing.name}`);
    res.json({ message: `Agent "${existing.name}" deleted successfully.` });
  } catch (err) {
    console.error("DELETE /agents/:id error:", err.message);
    res.status(500).json({ error: "Failed to delete agent." });
  }
});

await seedAgents();

app.listen(PORT, async () => {
  console.log(`App:  http://localhost:${PORT}`);
});

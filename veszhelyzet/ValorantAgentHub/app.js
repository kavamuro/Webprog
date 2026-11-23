import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db, { syncAgents } from "./database/db.js";
import authRouter, { loadUser, requireLogin } from "./auth.js";
import uploadsRouter, { canUseImage, removeUnusedUpload } from "./uploads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(loadUser);
app.use(["/auth", "/agents"], (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/auth", authRouter);
app.use("/uploads", uploadsRouter);

const AGENT_SELECT = `
  SELECT a.*, u.username AS owner
  FROM agents a LEFT JOIN users u ON u.id = a.userId`;

// Visitors can only see public agents, users also see their own private ones.
function findVisibleAgent(id, user) {
  return db
    .prepare(
      `${AGENT_SELECT} WHERE a.id = ? AND (a.isPublic = 1 OR a.userId = ?)`,
    )
    .get(id, user?.id ?? null);
}

function agentError(body, userId) {
  const { name, role, imageUrl, description, isPublic } = body ?? {};
  const isText = (value) => value == null || typeof value === "string";

  if (![name, role, imageUrl, description].every(isText)) {
    return "Agent fields must be text.";
  }
  if (isPublic !== undefined && typeof isPublic !== "boolean") {
    return "isPublic must be true or false.";
  }
  if (!name?.trim()) return "Agent name is required.";
  if (!imageUrl?.trim()) return "Image URL is required.";
  if (!canUseImage(imageUrl.trim(), userId)) {
    return "This uploaded image is not available to you.";
  }
  return null;
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT, time: new Date().toISOString() });
});

app.get("/agents", (req, res) => {
  try {
    const agents = db
      .prepare(
        `${AGENT_SELECT} WHERE a.isPublic = 1 OR a.userId = ? ORDER BY a.name ASC`,
      )
      .all(req.user?.id ?? null);
    console.log(`GET /agents → ${agents.length} agents`);
    res.json(agents);
  } catch (err) {
    console.error("GET /agents error:", err.message);
    res.status(500).json({ error: "Failed to retrieve agents." });
  }
});

app.get("/agents/:id", (req, res) => {
  try {
    const agent = findVisibleAgent(req.params.id, req.user);
    if (!agent) return res.status(404).json({ error: "Agent not found." });
    res.json(agent);
  } catch (err) {
    console.error("GET /agents/:id error:", err.message);
    res.status(500).json({ error: "Failed to retrieve agent." });
  }
});

app.post("/agents", requireLogin, (req, res) => {
  console.log("POST /agents body:", req.body);
  const error = agentError(req.body, req.user.id);
  if (error) return res.status(400).json({ error });
  const { name, role, imageUrl, description, isPublic } = req.body;

  try {
    const result = db
      .prepare(
        "INSERT INTO agents (name, role, imageUrl, description, userId, isPublic) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run(
        name.trim(),
        role?.trim() || null,
        imageUrl.trim(),
        description?.trim() || null,
        req.user.id,
        isPublic === false ? 0 : 1,
      );

    const newAgent = findVisibleAgent(result.lastInsertRowid, req.user);
    console.log(
      `POST /agents → Created agent: ${newAgent.name} (id: ${newAgent.id})`,
    );
    res.status(201).json(newAgent);
  } catch (err) {
    console.error("POST /agents error:", err.message);
    res.status(500).json({ error: "Failed to add agent." });
  }
});

app.put("/agents/:id", requireLogin, (req, res) => {
  const error = agentError(req.body, req.user.id);
  if (error) return res.status(400).json({ error });
  const { name, role, imageUrl, description, isPublic } = req.body;

  try {
    const existing = findVisibleAgent(req.params.id, req.user);
    if (!existing) return res.status(404).json({ error: "Agent not found." });
    if (existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own agents." });
    }

    db.prepare(
      "UPDATE agents SET name = ?, role = ?, imageUrl = ?, description = ?, isPublic = ? WHERE id = ?",
    ).run(
      name.trim(),
      role?.trim() || null,
      imageUrl.trim(),
      description?.trim() || null,
      Number(isPublic ?? existing.isPublic),
      existing.id,
    );
    removeUnusedUpload(existing.imageUrl, req.user.id);

    const updated = findVisibleAgent(existing.id, req.user);
    console.log(`PUT /agents/${req.params.id} → Updated: ${updated.name}`);
    res.json(updated);
  } catch (err) {
    console.error("PUT /agents/:id error:", err.message);
    res.status(500).json({ error: "Failed to update agent." });
  }
});

app.delete("/agents/:id", requireLogin, (req, res) => {
  try {
    const existing = findVisibleAgent(req.params.id, req.user);
    if (!existing) return res.status(404).json({ error: "Agent not found." });
    if (existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own agents." });
    }

    db.prepare("DELETE FROM agents WHERE id = ?").run(existing.id);
    removeUnusedUpload(existing.imageUrl, req.user.id);
    console.log(`DELETE /agents/${req.params.id} → Deleted: ${existing.name}`);
    res.json({ message: `Agent "${existing.name}" deleted successfully.` });
  } catch (err) {
    console.error("DELETE /agents/:id error:", err.message);
    res.status(500).json({ error: "Failed to delete agent." });
  }
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) console.error("Server error:", err.message);
  let error = "Something went wrong.";
  if (status === 413) error = "The file is too large (5 MB maximum).";
  else if (status < 500) error = "Invalid request.";
  res.status(status).json({ error });
});

await syncAgents();

app.listen(PORT, async () => {
  console.log(`App:  http://localhost:${PORT}`);
});

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { Router } from "express";
import db from "./database/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const PREFIX = "/uploads/";

// Decides the type from the file's content, not from what the browser claims.
function imageExtension(buf) {
  if (buf.subarray(0, 4).toString("hex") === "89504e47") return "png";
  if (buf.subarray(0, 3).toString("hex") === "ffd8ff") return "jpg";
  if (/^GIF8[79]a/.test(buf.subarray(0, 6).toString("latin1"))) return "gif";
  if (
    buf.subarray(0, 4).toString("latin1") === "RIFF" &&
    buf.subarray(8, 12).toString("latin1") === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

function removeFile(filename) {
  fs.rmSync(path.join(UPLOAD_DIR, filename), { force: true });
}

// External URLs are allowed; an uploaded image must belong to the user.
export function canUseImage(imageUrl, userId) {
  if (!imageUrl.startsWith(PREFIX)) return true;
  return Boolean(
    db
      .prepare("SELECT 1 FROM uploads WHERE filename = ? AND userId = ?")
      .get(imageUrl.slice(PREFIX.length), userId),
  );
}

// Deletes an uploaded image once none of the agents use it.
export function removeUnusedUpload(imageUrl, userId) {
  if (!imageUrl.startsWith(PREFIX) || !canUseImage(imageUrl, userId)) return;
  if (db.prepare("SELECT 1 FROM agents WHERE imageUrl = ?").get(imageUrl)) return;
  const filename = imageUrl.slice(PREFIX.length);
  db.prepare("DELETE FROM uploads WHERE filename = ?").run(filename);
  removeFile(filename);
}

export function removeUserUploads(userId) {
  const files = db
    .prepare("SELECT filename FROM uploads WHERE userId = ?")
    .all(userId);
  db.prepare("DELETE FROM uploads WHERE userId = ?").run(userId);
  for (const { filename } of files) removeFile(filename);
}

const router = Router();

router.post(
  "/",
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Please log in first." });
    next();
  },
  express.raw({ type: "image/*", limit: "5mb" }),
  (req, res) => {
    const extension = Buffer.isBuffer(req.body) ? imageExtension(req.body) : null;
    if (!extension) {
      return res
        .status(400)
        .json({ error: "Only PNG, JPG, GIF or WEBP images can be uploaded." });
    }
    const filename = `${crypto.randomUUID()}.${extension}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), req.body);
    db.prepare("INSERT INTO uploads (filename, userId) VALUES (?, ?)").run(
      filename,
      req.user.id,
    );
    res.status(201).json({ imageUrl: PREFIX + filename });
  },
);


router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const allowed = db
    .prepare(
      `SELECT 1 FROM uploads
       WHERE filename = @filename AND (userId = @userId OR EXISTS
         (SELECT 1 FROM agents WHERE imageUrl = @imageUrl AND isPublic = 1))`,
    )
    .get({
      filename,
      userId: req.user?.id ?? null,
      imageUrl: PREFIX + filename,
    });
  if (!allowed) return res.status(404).json({ error: "Image not found." });

  res.set("Cache-Control", "private, no-cache");
  res.set("X-Content-Type-Options", "nosniff");
  res.sendFile(filename, { root: UPLOAD_DIR, cacheControl: false });
});

export default router;

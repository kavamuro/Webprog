import crypto from "node:crypto";
import { promisify } from "node:util";
import { Router } from "express";
import db from "./database/db.js";
import { removeUserUploads } from "./uploads.js";

const scrypt = promisify(crypto.scrypt);

const COOKIE = "session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

const str = (value) => (typeof value === "string" ? value : "");
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

async function checkPassword(password, stored) {
  const [salt, key] = stored.split(":").map((part) => Buffer.from(part, "hex"));
  return crypto.timingSafeEqual(await scrypt(password, salt, 64), key);
}

function usernameError(username) {
  return /^[A-Za-z0-9_]{3,20}$/.test(username)
    ? null
    : "Username must be 3-20 characters: letters, numbers or _.";
}

function passwordError(password) {
  return password.length >= 8 && password.length <= 128
    ? null
    : "Password must be 8-128 characters long.";
}

function getToken(req) {
  for (const part of (req.headers.cookie ?? "").split(";")) {
    const [name, value] = part.trim().split("=");
    if (name === COOKIE && value) return value;
  }
  return null;
}

function startSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessions WHERE expiresAt < ?").run(Date.now());
  db.prepare(
    "INSERT INTO sessions (tokenHash, userId, expiresAt) VALUES (?, ?, ?)",
  ).run(hashToken(token), userId, Date.now() + SESSION_MS);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MS,
  });
}

// Sets req.user to { id, username }, or null for visitors.
export function loadUser(req, res, next) {
  const token = getToken(req);
  req.user = token
    ? (db
        .prepare(
          `SELECT u.id, u.username FROM sessions s
           JOIN users u ON u.id = s.userId
           WHERE s.tokenHash = ? AND s.expiresAt > ?`,
        )
        .get(hashToken(token), Date.now()) ?? null)
    : null;
  next();
}

export function requireLogin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Please log in first." });
  next();
}

const router = Router();

router.get("/me", (req, res) => res.json({ user: req.user }));

router.post("/register", async (req, res) => {
  const username = str(req.body?.username).trim();
  const password = str(req.body?.password);

  const error = usernameError(username) ?? passwordError(password);
  if (error) return res.status(400).json({ error });

  const hash = await hashPassword(password);
  try {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO users (username, passwordHash) VALUES (?, ?)")
      .run(username, hash);
    startSession(res, lastInsertRowid);
    res.status(201).json({ user: { id: Number(lastInsertRowid), username } });
  } catch (err) {
    if (err.code !== "SQLITE_CONSTRAINT_UNIQUE") throw err;
    res.status(409).json({ error: "This username is already taken." });
  }
});

router.post("/login", async (req, res) => {
  const username = str(req.body?.username).trim();
  const password = str(req.body?.password);

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!user || !(await checkPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "Wrong username or password." });
  }
  startSession(res, user.id);
  res.json({ user: { id: user.id, username: user.username } });
});

router.post("/logout", (req, res) => {
  const token = getToken(req);
  if (token) {
    db.prepare("DELETE FROM sessions WHERE tokenHash = ?").run(hashToken(token));
  }
  res.clearCookie(COOKIE);
  res.json({ message: "Logged out." });
});

// Changing or deleting the account always needs the current password.
async function confirmPassword(req, res, next) {
  const { passwordHash } = db
    .prepare("SELECT passwordHash FROM users WHERE id = ?")
    .get(req.user.id);
  if (!(await checkPassword(str(req.body?.currentPassword), passwordHash))) {
    return res.status(403).json({ error: "Current password is wrong." });
  }
  next();
}

router.put("/me", requireLogin, confirmPassword, async (req, res) => {
  const username = str(req.body.username).trim();
  const newPassword = str(req.body.newPassword);

  const error =
    usernameError(username) ?? (newPassword ? passwordError(newPassword) : null);
  if (error) return res.status(400).json({ error });

  const hash = newPassword ? await hashPassword(newPassword) : null;
  try {
    db.transaction(() => {
      db.prepare("UPDATE users SET username = ? WHERE id = ?").run(
        username,
        req.user.id,
      );
      if (hash) {
        db.prepare("UPDATE users SET passwordHash = ? WHERE id = ?").run(
          hash,
          req.user.id,
        );
        // Log out every other device after a password change.
        db.prepare(
          "DELETE FROM sessions WHERE userId = ? AND tokenHash <> ?",
        ).run(req.user.id, hashToken(getToken(req)));
      }
    })();
    res.json({ user: { id: req.user.id, username } });
  } catch (err) {
    if (err.code !== "SQLITE_CONSTRAINT_UNIQUE") throw err;
    res.status(409).json({ error: "This username is already taken." });
  }
});

router.delete("/me", requireLogin, confirmPassword, (req, res) => {
  removeUserUploads(req.user.id);
  // Agents and sessions of the user are removed by ON DELETE CASCADE.
  db.prepare("DELETE FROM users WHERE id = ?").run(req.user.id);
  res.clearCookie(COOKIE);
  res.json({ message: "Account deleted." });
});

export default router;

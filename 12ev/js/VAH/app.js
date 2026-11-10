import express from 'express';
import db from './database/db.js'; // Notice the '.js' extension! It's mandatory here.
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTES (These remain exactly the same) ---

app.get('/agents', (req, res) => {
    const agents = db.prepare('SELECT * FROM agents').all();
    res.json(agents);
});

app.get('/agents/:id', (req, res) => {
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
});

app.post('/agents', (req, res) => {
    const { name, role, imageUrl, description } = req.body;
    if (!name || !imageUrl) {
        return res.status(400).json({ error: 'Name and Image URL are required fields.' });
    }
    const stmt = db.prepare('INSERT INTO agents (name, role, imageUrl, description) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, role || 'Unknown', imageUrl, description || '');
    res.status(201).json({ id: info.lastInsertRowid, message: 'Agent created successfully' });
});

app.put('/agents/:id', (req, res) => {
    const { name, role, imageUrl, description } = req.body;
    const { id } = req.params;
    if (!name || !imageUrl) {
        return res.status(400).json({ error: 'Name and Image URL are required fields.' });
    }
    const stmt = db.prepare('UPDATE agents SET name = ?, role = ?, imageUrl = ?, description = ? WHERE id = ?');
    const info = stmt.run(name, role, imageUrl, description, id);
    if (info.changes === 0) return res.status(404).json({ error: 'Agent not found' });
    res.json({ message: 'Agent updated successfully' });
});

app.delete('/agents/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM agents WHERE id = ?');
    const info = stmt.run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Agent not found' });
    res.json({ message: 'Agent deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Valorant Agent Hub running on http://localhost:${PORT}`);
});
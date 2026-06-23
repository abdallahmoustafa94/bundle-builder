import express from 'express';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

// Bonus: serve the bundle catalog from a tiny API instead of importing the
// JSON directly into the frontend. Read on each request so edits to
// catalog.json are picked up without restarting in development.
app.get('/api/catalog', async (_req, res) => {
  try {
    const raw = await readFile(join(__dirname, 'catalog.json'), 'utf-8');
    res.type('application/json').send(raw);
  } catch (err) {
    console.error('Failed to read catalog.json', err);
    res.status(500).json({ error: 'Failed to load catalog' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Production: serve the built frontend so `npm run build && npm start` runs the
// whole app from one process. In development Vite serves the UI and proxies /api.
const distDir = join(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => res.sendFile(join(distDir, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Catalog API listening on http://localhost:${PORT}`);
});

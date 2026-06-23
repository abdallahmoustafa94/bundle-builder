import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Vercel serverless handler — mirrors server/index.js GET /api/catalog */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const raw = await readFile(join(process.cwd(), 'server', 'catalog.json'), 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(raw);
  } catch (err) {
    console.error('Failed to read catalog.json', err);
    res.status(500).json({ error: 'Failed to load catalog' });
  }
}

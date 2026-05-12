import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db, initDb } from './src/db/db.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

console.log("Environment Check:");
console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
console.log("API_KEY present:", !!process.env.API_KEY);

app.use(express.json({ limit: '50mb' }));

// Initialize Database
initDb();

// API Routes

// 1. Get Dashboard Stats
app.get('/api/stats', (req, res) => {
  try {
    const alertCount = db.prepare('SELECT COUNT(*) as count FROM alerts').get() as { count: number };
    const highRiskCount = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'High'").get() as { count: number };
    const recentAlerts = db.prepare('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 5').all();
    
    res.json({
      totalAlerts: alertCount.count,
      highRiskAlerts: highRiskCount.count,
      recentAlerts
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 2. Create Alert (Called by Client Agent)
app.post('/api/alerts', (req, res) => {
  try {
    const { type, severity, location, confidence, image_data, status } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO alerts (type, severity, location, confidence, image_data, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(type, severity, location, confidence, image_data, status);

    // Log agent action
    db.prepare('INSERT INTO agent_logs (agent_name, action, details) VALUES (?, ?, ?)').run(
      'AlertAgent',
      'Created Alert',
      `Alert ID ${info.lastInsertRowid} created for ${type}`
    );

    res.json({ id: info.lastInsertRowid, success: true });
  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// 3. Get Alert History
app.get('/api/alerts', (req, res) => {
  const alerts = db.prepare('SELECT * FROM alerts ORDER BY timestamp DESC').all();
  res.json(alerts);
});

// Vite Middleware
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Serve static files in production
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

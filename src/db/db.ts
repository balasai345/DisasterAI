import Database from 'better-sqlite3';
import path from 'path';

export const db = new Database('disaster_risk.db');

export function initDb() {
  // Alerts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      location TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      confidence REAL,
      image_data TEXT, -- Storing base64 thumbnail for MVP simplicity
      status TEXT DEFAULT 'Active'
    )
  `);

  // Logs Table for Agent Actions
  db.exec(`
    CREATE TABLE IF NOT EXISTS agent_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_name TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized');
}

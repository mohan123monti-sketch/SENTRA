import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function seed() {
  const db = await open({
    filename: path.join(process.cwd(), 'database', 'sentra.db'),
    driver: sqlite3.Database
  });

  await db.run(
    `INSERT OR REPLACE INTO victims (
      id, name, gender, mail, mobileNumber, location, relativeDetails,
      age, caseId, caseType, preferredLanguage, profilePhotoUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'V-9042', 'Priya Sharma', 'Female', 'priya.sharma@example.com', '+91 9876543210', 'Delhi, India', 'Brother: Amit',
      '28', 'CASE-2026-0819', 'Domestic Violence', 'en', ''
    ]
  );
  
  console.log('Seeded victim V-9042 successfully.');
}

seed().catch(console.error);

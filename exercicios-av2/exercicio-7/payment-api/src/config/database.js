const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'db', 'payment.db');

async function openDb() {
    const db = await sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            valorMaximo REAL NOT NULL,
            tipo TEXT CHECK(tipo IN ('ELETRONICO', 'FISICO')) NOT NULL
        );
    `);

    return db;
}

module.exports = openDb;
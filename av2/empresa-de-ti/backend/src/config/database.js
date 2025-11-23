const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'db', 'av2.db');

async function openDb() {
    const db = await sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Cliente (
            email TEXT PRIMARY KEY NOT NULL,
            senha TEXT NOT NULL,
            nome TEXT NOT NULL,
            cpf TEXT,
            dataNascimento TEXT,
            telefone TEXT,
            estadoCivil TEXT,
            escolaridade TEXT
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS ServicoTI (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            preco REAL NOT NULL,
            prazoDias INTEGER NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Solicitacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_cliente TEXT NOT NULL,
            id_servico INTEGER NOT NULL,
            dataPedido TEXT NOT NULL,
            numeroSolicitacao TEXT NOT NULL,
            status TEXT NOT NULL,
            preco REAL NOT NULL,
            dataPrevista TEXT,
            FOREIGN KEY (email_cliente) REFERENCES Cliente(email) ON DELETE CASCADE,
            FOREIGN KEY (id_servico) REFERENCES ServicoTI(id) ON DELETE CASCADE
        );
    `);

    const servicoCount = await db.get('SELECT COUNT(*) AS count FROM ServicoTI');
    if (servicoCount.count === 0) {
        await db.run("INSERT INTO ServicoTI (nome, preco, prazoDias) VALUES (?, ?, ?)", ["Manutenção de Computadores", 150.00, 3]);
        await db.run("INSERT INTO ServicoTI (nome, preco, prazoDias) VALUES (?, ?, ?)", ["Suporte Remoto", 80.00, 1]);
        await db.run("INSERT INTO ServicoTI (nome, preco, prazoDias) VALUES (?, ?, ?)", ["Segurança da Informação", 300.00, 5]);
    }

    return db;
}

module.exports = openDb;
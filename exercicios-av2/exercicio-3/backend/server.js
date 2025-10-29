const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados: " + err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL
        )`, (err) => {
            if (err) {
                console.log("Erro ao criar a tabela: " + err.message);
            }
        });
    }
});

app.get('/api/produtos', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco } = req.body;
    const insert = 'INSERT INTO produtos (nome, descricao, preco) VALUES (?,?,?)';
    db.run(insert, [nome, descricao, preco], function (err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, nome, descricao, preco }
        });
    });
});

app.put('/api/produtos/:id', (req, res) => {
    const { nome, descricao, preco } = req.body;
    const id = req.params.id;
    db.run(
        `UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?`,
        [nome, descricao, preco, id],
        function (err) {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                "message": "success",
                "changes": this.changes
            });
        }
    );
});

app.delete('/api/produtos/:id', (req, res) => {
    const id = req.params.id;
    db.run(
        'DELETE FROM produtos WHERE id = ?',
        id,
        function (err) {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({ "message": "deleted", "changes": this.changes });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
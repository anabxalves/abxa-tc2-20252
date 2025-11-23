const express = require('express');
const bodyParser = require('body-parser');
const corsMiddleware = require('./config/cors.js');
const openDb = require('./config/database.js');
const apiRoutes = require('./routes/index.js');

const app = express();
const PORT = 3000;

app.use(corsMiddleware);
app.use(bodyParser.json());

app.use('/api', apiRoutes);

async function startServer() {
    try {
        await openDb();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Falha ao iniciar o servidor ou conectar ao DB:", error);
    }
}

startServer();
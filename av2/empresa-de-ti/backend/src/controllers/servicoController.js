const openDb = require('../config/database');

const servicoController = {
    create: async (req, res) => {
        const { nome, preco, prazoDias } = req.body;

        if (!nome || typeof preco !== 'number' || preco <= 0 || typeof prazoDias !== 'number' || prazoDias <= 0) {
            return res.status(400).json({ status: 'erro', message: 'Dados de serviço de TI incompletos ou inválidos.' });
        }

        const db = await openDb();
        try {
            const result = await db.run(
                'INSERT INTO ServicoTI (nome, preco, prazoDias) VALUES (?, ?, ?)',
                [nome, preco, prazoDias]
            );
            return res.status(201).json({ status: 'sucesso', id: result.lastID, nome, preco, prazoDias });
        } catch (error) {
            console.error("Erro ao cadastrar serviço:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno ao cadastrar serviço.' });
        } finally {
            await db.close();
        }
    },

    findAll: async (req, res) => {
        const db = await openDb();
        try {
            const servicos = await db.all('SELECT * FROM ServicoTI ORDER BY nome');
            return res.json({ status: 'sucesso', data: servicos });
        } catch (error) {
            console.error("Erro ao consultar serviços:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno ao consultar serviços.' });
        } finally {
            await db.close();
        }
    }
};

module.exports = servicoController;
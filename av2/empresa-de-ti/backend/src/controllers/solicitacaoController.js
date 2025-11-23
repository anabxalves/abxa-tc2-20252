const openDb = require('../config/database');

const solicitacaoController = {
    findByUser: async (req, res) => {
        const { login } = req.params;

        if (!login) {
            return res.status(400).json({ status: 'erro', message: 'Login do usuário é obrigatório.' });
        }

        const db = await openDb();
        try {
            const solicitacoes = await db.all(
                `SELECT 
                    s.dataPedido, s.numeroSolicitacao, s.status, s.preco, s.dataPrevista, s.id,
                    t.nome as servicoNome
                FROM Solicitacao s
                JOIN ServicoTI t ON s.id_servico = t.id
                WHERE s.email_cliente = ?
                ORDER BY s.dataPedido ASC`,
                login
            );
            return res.json({ status: 'sucesso', data: solicitacoes });
        } catch (error) {
            console.error("Erro ao consultar solicitações:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno ao consultar solicitações.' });
        } finally {
            await db.close();
        }
    },

    updateUserRequests: async (req, res) => {
        const { login } = req.params;
        const { solicitacoes } = req.body;

        if (!login || !Array.isArray(solicitacoes)) {
            return res.status(400).json({ status: 'erro', message: 'Login e lista de solicitações válidos são obrigatórios.' });
        }

        const db = await openDb();
        try {
            await db.run('DELETE FROM Solicitacao WHERE email_cliente = ?', login);

            const stmt = await db.prepare(
                'INSERT INTO Solicitacao (email_cliente, id_servico, dataPedido, numeroSolicitacao, status, preco, dataPrevista) VALUES (?, ?, ?, ?, ?, ?, ?)'
            );

            for (const s of solicitacoes) {
                if (!s.id_servico || !s.dataPedido || !s.preco) continue;

                await stmt.run(login, s.id_servico, s.dataPedido, s.numeroSolicitacao, s.status, s.preco, s.dataPrevista);
            }
            await stmt.finalize();

            return res.json({ status: 'sucesso', message: 'Solicitações atualizadas com sucesso.' });
        } catch (error) {
            console.error("Erro ao atualizar solicitações:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno ao atualizar solicitações.' });
        } finally {
            await db.close();
        }
    }
};

module.exports = solicitacaoController;
const openDb = require('../config/database');

const validatePaymentData = (data) => {
    const { nome, valorMaximo, tipo } = data;
    const errors = [];

    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
        errors.push("O campo 'nome' é obrigatório.");
    }

    if (typeof valorMaximo !== 'number' || valorMaximo <= 0) {
        errors.push("O campo 'valorMaximo' deve ser um número positivo.");
    }

    const allowedTypes = ['ELETRONICO', 'FISICO'];
    if (!tipo || !allowedTypes.includes(tipo)) {
        errors.push("O campo 'tipo' deve ser 'ELETRONICO' ou 'FISICO'.");
    }

    return errors;
};

const paymentController = {
    findAll: async (req, res) => {
        const db = await openDb();
        const filterType = req.query.tipo;

        let sql = 'SELECT id, nome, valorMaximo, tipo FROM payments';
        let params = [];

        if (filterType) {
            const allowedTypes = ['ELETRONICO', 'FISICO'];
            const upperType = filterType.toUpperCase();

            if (allowedTypes.includes(upperType)) {
                sql += ' WHERE tipo = ?';
                params.push(upperType);
            } else {
                return res.status(400).json({
                    message: "Filtro de tipo inválido.",
                    errors: ["O tipo deve ser 'ELETRONICO' ou 'FISICO'."]
                });
            }
        }

        try {
            const payments = await db.all(sql, params);
            res.json(payments);
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            res.status(500).json({ message: 'Erro ao buscar todos os pagamentos.' });
        } finally {
            await db.close();
        }
    },

    findById: async (req, res) => {
        const db = await openDb();
        const id = parseInt(req.params.id);
        try {
            const payment = await db.get('SELECT id, nome, valorMaximo, tipo FROM payments WHERE id = ?', id);

            if (payment) {
                res.json(payment);
            } else {
                res.status(404).json({ message: 'Meio de pagamento não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar pagamento por ID.' });
        } finally {
            await db.close();
        }
    },

    create: async (req, res) => {
        const validationErrors = validatePaymentData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: validationErrors
            });
        }

        const db = await openDb();
        const { nome, valorMaximo, tipo } = req.body;
        const sql = 'INSERT INTO payments (nome, valorMaximo, tipo) VALUES (?, ?, ?);';

        try {
            const result = await db.run(sql, nome, valorMaximo, tipo);
            res.status(201).json({ id: result.lastID, nome, valorMaximo, tipo });
        } catch (error) {
            console.error("Erro ao incluir pagamento:", error);
            res.status(500).json({ message: 'Erro interno ao incluir pagamento.' });
        } finally {
            await db.close();
        }
    },

    update: async (req, res) => {
        const validationErrors = validatePaymentData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Dados inválidos para alteração",
                errors: validationErrors
            });
        }

        const db = await openDb();
        const id = parseInt(req.params.id);
        const { nome, valorMaximo, tipo } = req.body;

        const sql = `
            UPDATE payments 
            SET nome = ?, valorMaximo = ?, tipo = ?
            WHERE id = ?;
        `;

        try {
            const result = await db.run(sql, nome, valorMaximo, tipo, id);

            if (result.changes > 0) {
                res.json({ id, nome, valorMaximo, tipo });
            } else {
                res.status(404).json({ message: 'Meio de pagamento não encontrado para alteração.' });
            }
        } catch (error) {
            console.error("Erro ao alterar pagamento:", error);
            res.status(500).json({ message: 'Erro interno ao alterar pagamento.' });
        } finally {
            await db.close();
        }
    },

    remove: async (req, res) => {
        const db = await openDb();
        const id = parseInt(req.params.id);

        try {
            const result = await db.run('DELETE FROM payments WHERE id = ?', id);

            if (result.changes > 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Meio de pagamento não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao excluir pagamento.' });
        } finally {
            await db.close();
        }
    }
};

module.exports = paymentController;
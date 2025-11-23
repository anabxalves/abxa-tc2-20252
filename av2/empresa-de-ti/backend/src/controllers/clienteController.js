const openDb = require('../config/database');

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const clienteController = {
    create: async (req, res) => {
        const { email, senha, nome, cpf, dataNascimento, telefone, estadoCivil, escolaridade } = req.body;

        if (!email || !senha || !nome || !validateEmail(email)) {
            return res.status(400).json({ status: 'erro', message: 'Dados de cliente incompletos ou inválidos.' });
        }

        const db = await openDb();
        try {
            const existingClient = await db.get('SELECT email FROM Cliente WHERE email = ?', email);
            if (existingClient) {
                return res.status(409).json({ status: 'erro', message: 'Login (e-mail) já cadastrado.' });
            }

            const result = await db.run(
                'INSERT INTO Cliente (email, senha, nome, cpf, dataNascimento, telefone, estadoCivil, escolaridade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [email, senha, nome, cpf, dataNascimento, telefone, estadoCivil, escolaridade]
            );
            return res.status(201).json({ status: 'sucesso', message: 'Cliente cadastrado com sucesso.' });
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno ao cadastrar cliente.' });
        } finally {
            await db.close();
        }
    },

    authenticate: async (req, res) => {
        const { login, senha } = req.body;

        if (!login || !senha) {
            return res.status(400).json({ status: 'erro', message: 'Login e senha são obrigatórios.' });
        }

        const db = await openDb();
        try {
            const cliente = await db.get('SELECT email, senha FROM Cliente WHERE email = ?', login);

            if (cliente && cliente.senha === senha) {
                return res.json({ status: 'sucesso', authenticated: true });
            } else {
                return res.status(401).json({ status: 'erro', message: 'Login ou senha inválidos.' });
            }
        } catch (error) {
            console.error("Erro na autenticação:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno na autenticação.' });
        } finally {
            await db.close();
        }
    },

    changePassword: async (req, res) => {
        const { login, senhaAtual, novaSenha } = req.body;

        if (!login || !senhaAtual || !novaSenha) {
            return res.status(400).json({ status: 'erro', message: 'Todos os campos de senha são obrigatórios.' });
        }

        const db = await openDb();
        try {
            const cliente = await db.get('SELECT email, senha FROM Cliente WHERE email = ?', login);

            if (!cliente || cliente.senha !== senhaAtual) {
                return res.status(401).json({ status: 'erro', message: 'Senha atual inválida.' });
            }

            const result = await db.run('UPDATE Cliente SET senha = ? WHERE email = ?', [novaSenha, login]);

            if (result.changes > 0) {
                return res.json({ status: 'sucesso', message: 'Senha alterada com sucesso.' });
            } else {
                return res.status(500).json({ status: 'erro', message: 'Erro ao atualizar a senha.' });
            }
        } catch (error) {
            console.error("Erro na troca de senha:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno na troca de senha.' });
        } finally {
            await db.close();
        }
    },

    findByEmail: async (req, res) => {
        const { email } = req.params;
        const db = await openDb();

        try {
            const cliente = await db.get(
                'SELECT email, nome, cpf, dataNascimento, telefone, estadoCivil, escolaridade FROM Cliente WHERE email = ?',
                email
            );
            if (cliente) {
                return res.json({ status: 'sucesso', data: cliente });
            } else {
                return res.status(404).json({ status: 'erro', message: 'Cliente não encontrado.' });
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            return res.status(500).json({ status: 'erro', message: 'Erro interno ao buscar cliente.' });
        } finally {
            await db.close();
        }
    },
};

module.exports = clienteController;
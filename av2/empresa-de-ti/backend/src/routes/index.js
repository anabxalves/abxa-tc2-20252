const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');
const servicoController = require('../controllers/servicoController');
const solicitacaoController = require('../controllers/solicitacaoController');

router.post('/clientes/cadastro', clienteController.create);
router.post('/clientes/autenticar', clienteController.authenticate);
router.put('/clientes/troca-senha', clienteController.changePassword);
router.get('/clientes/:email', (req, res, next) => {
    req.params.email = decodeURIComponent(req.params.email);
    next();
}, clienteController.findByEmail);

router.post('/servicos/cadastro', servicoController.create);
router.get('/servicos', servicoController.findAll);

router.get('/solicitacoes/:login', solicitacaoController.findByUser);
router.put('/solicitacoes/:login', solicitacaoController.updateUserRequests);

module.exports = router;
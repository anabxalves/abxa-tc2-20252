const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.findAll);
router.get('/:id', paymentController.findById);
router.post('/', paymentController.create);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.remove);

module.exports = router;
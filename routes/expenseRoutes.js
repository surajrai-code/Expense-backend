const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expenseController');

router.post('/create', expenseController.createExpense);
router.get('/get', expenseController.getAllExpenses);
router.put('/edit/:id', expenseController.updateExpense);
router.delete('/delete/:id', expenseController.deleteExpense);

module.exports = router;

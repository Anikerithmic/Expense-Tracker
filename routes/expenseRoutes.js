
const express = require('express');

const expenseController = require('../controllers/expenseController');

const userAuthentication = require('../middleware/auth');

const router = express.Router();


router.get('/get-expenses', userAuthentication.authenticate, expenseController.getExpenses);

router.put('/edit-expense/:id', expenseController.editExpense);

router.post('/create-expense', userAuthentication.authenticate, expenseController.createExpense);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;

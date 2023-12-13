const Expense = require('../models/expense');
const path = require('path');

exports.signupPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
};

exports.createUser = (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const userData = { username: username, email: email, password: password };
        res.status(201).json({ newUserDetails: userData });
    } catch (err) {
        console.log('Error creating user:', err)
        res.status(500).json({
            error: err
        });
    }
};

exports.createExpense = async (req, res, next) => {
    try {
        if (!req.body.amount) {
            throw new Error('Anmount is Mandatory!');
        }
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({ amount: amount, description: description, category: category });
        res.status(201).json({ newExpenseDetails: data });
    } catch (err) {
        console.log('Error creating expense:', err)
        res.status(500).json({
            error: err
        });
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.editExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        console.log('Received request for edit with ID:', expenseId);
        const expense = await Expense.findByPk(expenseId);

        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
        } else {
            res.json(expense);
        }
    } catch (err) {
        console.error('Error fetching expense:', err);
        res.status(500).json({ error: err.message });
    }
};


exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        const expense = await Expense.findByPk(expenseId);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found!' });
        }

        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (err) {
        console.err('Error deleting expense:', err);
        res.status(500).json({ error: err });
    }
}
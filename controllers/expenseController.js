const Expense = require('../models/expense');
const User = require('../models/user');
const path = require('path');

exports.createExpense = async (req, res, next) => {
    try {
        if (!req.body.amount) {
            throw new Error('Amount is Mandatory!');
        }

        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({ userId: req.user.id, amount: amount, description: description, category: category });
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
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        const isPremiumUser = await User.findOne({ where: {id: req.user.id, ispremiumuser: true}});
        const userIsPremium = !!isPremiumUser;

        res.json({expenses, userIsPremium});

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

        if (expenseId == undefined || expenseId.length === 0) {
            return res.status(400).json({ success: false });
        }

        await Expense.destroy({ where: { userId: req.user.id } })
            .then((noOfRows) => {
                if (noOfRows == 0) {
                    return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
                }
                else {

                    return res.status(200).json({ message: 'Expense deleted successfully' });
                }
            })
    }
    catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: err });
    }
}
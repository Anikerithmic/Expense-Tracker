const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3services');


exports.downloadExpense = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        // It should depend upon the userId 
        const userId = req.user.id;
        const filename = `Expenses${userId}/${new Date()}.txt`;
        const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({ fileURL, success: true });
    }
    catch (err) {
        console.error('Error processing downloadExpense:', err);
        res.status(500).json({ fileURL: '', success: false, error: err });  
    }
};

exports.createExpense = async (req, res, next) => {
    let t;
    try {
        if (!req.body.amount) {
            throw new Error('Amount is Mandatory!');
        }
        t = await sequelize.transaction();
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({
            userId: req.user.id,
            amount: amount,
            description: description,
            category: category,

        }, { transaction: t });
        const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
        console.log(totalExpenses);
        const updatedUser = await User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t });

        if (!updatedUser) {
            await t.rollback();
            throw new Error('Failed to update user totalExpenses.');
        }
        await t.commit();
        res.status(201).json({ newExpenseDetails: data });
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        console.log('Error creating expense:', err)
        return res.status(500).json({ error: err });
    };
};

// Updated getExpenses function to support pagination
exports.getExpenses = async (req, res, next) => {
    try {
        const page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: { userId: req.user.id },
            limit: pageSize,
            offset: offset,
        });

        const totalPages = Math.ceil(count / pageSize);

        res.json({ expenses, totalPages, currentPage: parseInt(page) });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: err.message });
    }
};


// exports.getExpenses = async (req, res, next) => {
//     try {
//         const expenses = await Expense.findAll({ where: { userId: req.user.id } });
//         res.json({ expenses });

//     } catch (err) {
//         console.error('Error fetching expenses:', err);
//         res.status(500).json({ error: err.message });
//     }
// };

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
    let t;
    try {
        t = await sequelize.transaction();
        const expenseId = req.params.id;

        if (!expenseId) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Invalid expense ID' });
        }

        const expense = await Expense.findByPk(expenseId);

        if (!expense) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        if (expense.userId !== req.user.id) {
            await t.rollback();
            return res.status(403).json({ success: false, message: 'Expense does not belong to the user' });
        }

        const updatedAmount = req.user.totalExpenses - expense.amount;

        await Expense.destroy({ where: { id: expenseId }, transaction: t });

        await User.update({ totalExpenses: updatedAmount }, { where: { id: req.user.id }, transaction: t });

        await t.commit();
        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });

    } catch (err) {
        await t.rollback();
        console.error('Error deleting expense:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

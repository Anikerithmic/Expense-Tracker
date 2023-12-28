const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res) => {  
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {};

        expenses.forEach((expense) => {
            if (userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] += expense.amount;
            } else {
                // Initialize the total expense for the user if not present
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        });

        const userLeaderBoardDetails = [];
        users.forEach((user) => {
            // Use 0 as the default value if user has no expenses
            const totalExpense = userAggregatedExpenses[user.id] || 0;
            userLeaderBoardDetails.push({ name: user.username, totalExpense });
        });

        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);
    } catch (err) {
        console.error('Error in getUserLeaderBoard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

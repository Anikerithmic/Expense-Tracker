const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const usersleaderBoard = await User.findAll({
            attributes: ['id', 'username', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['users.id'],
            order: [['totalExpense', "DESC"]]
        });
      
        res.status(200).json(usersleaderBoard);

    } catch (err) {
        console.error('Error in UserLeaderBoard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

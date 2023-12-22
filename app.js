const express = require('express');
const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expenseRoutes');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');

const app = express();

app.use(express.static('public')); 
app.use(express.static('views')); 
app.use(express.json());
app.use(userRoutes);
app.use(expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });

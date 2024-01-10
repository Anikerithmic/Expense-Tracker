require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expenseRoutes');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const path = require('path');
const Order = require('./models/orders');
const purchaseRoute = require('./routes/purchase');
const premiumFeatureRoute = require('./routes/premiumFeature');
const PasswordRequest = require('./models/forgotpassword');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoute);
app.use(premiumFeatureRoute);

// app.use(helmet());

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(PasswordRequest);
PasswordRequest.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });

const express = require('express');
const expenseRoutes = require('./routes/expenseRoutes');
const sequelize = require('./util/database');

const app = express();

app.use(express.static('public')); 
app.use(express.static('views')); 
app.use(express.json());
app.use(expenseRoutes);

sequelize
    .sync()
    .then(result => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });

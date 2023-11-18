const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const sequelize = require('./util/database');

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(expenseRoutes);

sequelize
    .sync()
    .then(result => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });

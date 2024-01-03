const Sequelize = require('sequelize');
const database = require('../util/database');

const PasswordRequest = database.define('passwordrequest',{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
});


module.exports = PasswordRequest;
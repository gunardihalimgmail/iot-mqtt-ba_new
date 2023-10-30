const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const Message = sequelize.define('raws',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    device_id: Sequelize.STRING,
    messages: Sequelize.STRING,
    time: Sequelize.TIME,
   
  
}, {timestamps: false});

module.exports = Message;

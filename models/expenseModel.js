const {DataTypes } = require('sequelize');
const db = require('../config/db');

const Expense = db.define('Expense', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNumeric: true,
    }
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    }
  ]
});

module.exports = Expense;

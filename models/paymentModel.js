const {DataTypes } = require('sequelize');
const db = require('../config/db');
const Payment = db.define('Payment', {
    razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      razorpay_payment_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      razorpay_signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
    
      tableName: 'Payment',
      timestamps: false,
    });
  module.exports=Payment;
const express = require('express');
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const Expense = require('./models/expenseModel');
const User = require('./models/userModals');

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Setting database associations
Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

// Test the database connection and sync models
db.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sync();
  })
  .then(() => {
    console.log('Database synchronized...');
  })
  .catch(err => {
    console.error('Error: ' + err);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/payment', paymentRoutes);

// Define route handler for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, welcome!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

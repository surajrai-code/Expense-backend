const express = require('express');
const db = require('./config/db');
const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expenseRoutes');

// middleware
const app = express();
app.use(bodyParser.json());

// Test the database connection and sync models
db.authenticate()
  .then(() => {
    console.log('Database connected...');
    // Sync the database
    return db.sync();
  })
  .then(() => {
    console.log('Database synchronized...');
  })
  .catch(err => {
    console.error('Error: ' + err);
  });

// Routes
app.use('/expenses', expenseRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

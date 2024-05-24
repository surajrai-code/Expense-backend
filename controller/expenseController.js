const Expense = require('../models/expenseModel');
const User = require('../models/userModals');
const ExcelJS = require('exceljs');


// here we create data

const createExpense = async (req, res) => {
  try {
    const { name, category, amount } = req.body;
    const newExpense = await Expense.create({ name, category, amount });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// here we get all data
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// here we edit data by id

const updateExpense = async (req, res) => {
  try {
    const { name, category, amount } = req.body;
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    expense.name = name;
    expense.category = category;
    expense.amount = amount;
    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// here we delete data
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    await expense.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// download in excell data
const downloadExpenses = async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id, {
          include: [Expense]
      });

      if (user.role !== 'premium') {
          return res.status(403).json({ error: 'Only premium users can download expenses' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Expenses');

      worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Amount', key: 'amount', width: 10 },
          { header: 'Description', key: 'description', width: 30 },
          { header: 'Date', key: 'createdAt', width: 20 }
      ];

      user.Expenses.forEach(expense => {
          worksheet.addRow(expense.get({ plain: true }));
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');

      await workbook.xlsx.write(res);
      res.end();
  } catch (error) {
      res.status(500).json({ error: 'Error downloading expenses' });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  downloadExpenses,
};

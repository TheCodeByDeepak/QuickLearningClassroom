import React, { useState } from 'react';
import axios from 'axios';
import './CSS/ExpenseForm.css'

const ExpenseForm = ({ closeForm }) => {
  const [expenseData, setExpenseData] = useState({
    invoiceno:'',
    date: new Date().toISOString().split('T')[0],
    method: '',
    payedto:'',
    category:'',
    description: '',
    amount: '',
    additionalnote:''
  });

  const handleChange = (field, value) => {
    setExpenseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitExpense = async () => {
    if (!expenseData.invoiceno || !expenseData.method || !expenseData.payedto || !expenseData.category || !expenseData.description || !expenseData.amount) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/submit-expense', expenseData);
      alert('Expense submitted successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to submit expense:', err);
      alert('Failed to submit expense');
    }
  };

  return (
    <div className="expenseform-container">
    <h2 className="expenseform-title">Add Expense</h2>
    <p><strong>Note: </strong>Use the same <mark>Invoice No</mark> to re-update the Existing Expense </p>
  
    <div>
      <label className="expenseform-label">Invoice No:</label><div>
      <input
        type="text"
        placeholder="Invoice No"
        value={expenseData.invoiceno}
        onChange={(e) => handleChange('invoiceno', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <div>
      <label  className="expenseform-label">Date:</label><div>
      <input
        type="date"
        value={expenseData.date}
        onChange={(e) => handleChange('date', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <div>
      <label  className="expenseform-label">Payment Method:</label><div>
      <input
        type="text"
        placeholder="e.g., Cash, Card"
        value={expenseData.method}
        onChange={(e) => handleChange('method', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <div>
      <label  className="expenseform-label">Payed To:</label><div>
      <input
        type="text"
        placeholder="Payed To"
        value={expenseData.payedto}
        onChange={(e) => handleChange('payedto', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <div>
      <label className="expenseform-label">Category:</label><div>
      <input
        type="text"
        placeholder="Category"
        value={expenseData.category}
        onChange={(e) => handleChange('category', e.target.value)}
       className="expenseform-input"
      /></div>
    </div>
  
    <div>
      <label className="expenseform-label">Description:</label><div>
      <input
        type="text"
        placeholder="Expense description"
        value={expenseData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <div >
      <label className="expenseform-label">Amount:</label><div>
      <input
        type="number"
        placeholder="Amount"
        value={expenseData.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <div >
      <label className="expenseform-label">Additional Note:</label><div>
      <input
        type="text"
        placeholder="Additional Note"
        value={expenseData.additionalnote}
        onChange={(e) => handleChange('additionalnote', e.target.value)}
        className="expenseform-input"
      /></div>
    </div>
  
    <button
      onClick={submitExpense}
      className="expenseform-submit"
    >
      Submit Expense
    </button>
  </div>
  

  );
};

export default ExpenseForm;

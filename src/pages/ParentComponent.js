import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm'; // Import the ExpenseForm component

const ParentComponent = () => {
  const [showForm, setShowForm] = useState(false);

  // Define the closeForm function that hides the form
  const closeForm = () => {
    setShowForm(false); // Close the form when called
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add Expenses</button>

      {/* Pass closeForm as a prop to ExpenseForm */}
      {showForm && <ExpenseForm closeForm={closeForm} />}
    </div>
  );
};

export default ParentComponent;

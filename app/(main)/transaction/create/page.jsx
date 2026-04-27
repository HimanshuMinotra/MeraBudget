import { getUserAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import React from 'react';
import { getTransaction } from '@/actions/transaction';

// Import the new wrapper component, NOT the form itself
import TransactionFormLoader from '../_components/transaction-form-loader';

const AdTransactionPage = async ({ searchParams }) => {
  const { edit: editId } = (await searchParams) || {};
  const accounts = await getUserAccounts();
  
  console.log("Edit ID from URL:", editId);
   
  let initialData = null;
  if(editId) {
    try {
      const transaction = await getTransaction(editId);
      initialData = transaction;
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 mb-20 transform-gpu transition-all duration-700">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-12 uppercase">
          {editId ? "Edit" : "New"} <span className="text-primary italic">Transaction</span>
        </h1>

        {/* Render the loader, which will handle the dynamic import */}
        <TransactionFormLoader 
          accounts = {accounts}
          categories = {defaultCategories}
          editMode = {!!editId}
          initialData = {initialData}
        />
    </div>
  );
};

export default AdTransactionPage;
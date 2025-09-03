import React from 'react'
import { CiFilter,CiSearch } from "react-icons/ci";
import { useSelector,useDispatch } from 'react-redux';
import slice from '../redux/slices';

const mockTransactions = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Grocery Store",
    category: "Food & Dining",
    account: "Main Checking",
    type: "Expense",
    amount: -85.5,
    notes: "Weekly groceries",
  },
  {
    id: 2,
    date: "2024-01-15",
    description: "Salary Deposit",
    category: "Salary",
    account: "Main Checking",
    type: "Income",
    amount: 4500.0,
    notes: "Monthly salary",
  },
  {
    id: 3,
    date: "2024-01-14",
    description: "Gas Station",
    category: "Transportation",
    account: "Travel Credit Card",
    type: "Expense",
    amount: -45.2,
    notes: "Fill up tank",
  },
  {
    id: 4,
    date: "2024-01-14",
    description: "Netflix Subscription",
    category: "Entertainment",
    account: "Main Checking",
    type: "Expense",
    amount: -15.99,
    notes: "Monthly subscription",
  },
  {
    id: 5,
    date: "2024-01-13",
    description: "Freelance Payment",
    category: "Freelance",
    account: "Main Checking",
    type: "Income",
    amount: 750.0,
    notes: "Web design project",
  },
  {
    id: 6,
    date: "2024-01-12",
    description: "Transfer to Savings",
    category: "Transfer",
    account: "Main Checking → Emergency Savings",
    type: "Transfer",
    amount: -500.0,
    notes: "Monthly savings",
  },
  {
    id: 7,
    date: "2024-01-11",
    description: "Restaurant Dinner",
    category: "Food & Dining",
    account: "Travel Credit Card",
    type: "Expense",
    amount: -67.8,
    notes: "Date night",
  },
  {
    id: 8,
    date: "2024-01-10",
    description: "Online Course",
    category: "Education",
    account: "Main Checking",
    type: "Expense",
    amount: -199.0,
    notes: "React development course",
  },
  {
    id: 9,
    date: "2024-01-09",
    description: "Investment Dividend",
    category: "Investment",
    account: "Investment Account",
    type: "Income",
    amount: 125.5,
    notes: "Quarterly dividend",
  },
  {
    id: 10,
    date: "2024-01-08",
    description: "Coffee Shop",
    category: "Food & Dining",
    account: "Cash Wallet",
    type: "Expense",
    amount: -4.5,
    notes: "Morning coffee",
  },
]

const transactionTypes =  [
  {
    "value": "all",
    "display": "All Types"
  },
  {
    "value": "income",
    "display": "Income"
  },
  {
    "value": "expense",
    "display": "Expense"
  },
  {
    "value": "transfer",
    "display": "Transfer"
  }
]

const categoryTypes = [
  {
    "value": "all",
    "display": "All Categories"
  },
  {
    "value": "salary",
    "display": "Salary"
  },
  {
    "value": "freelance",
    "display": "Freelance"
  },
  {
    "value": "food_dining",
    "display": "Food & Dining"
  },
  {
    "value": "transportation",
    "display": "Transportation"
  },
  {
    "value": "entertainment",
    "display": "Entertainment"
  },
  {
    "value": "education",
    "display": "Education"
  },
  {
    "value": "investment",
    "display": "Investment"
  }
]

const accountTypes = [
  {
    "value": "all",
    "display": "All Accounts"
  },
  {
    "value": "main_checking",
    "display": "Main Checking"
  },
  {
    "value": "emergency_savings",
    "display": "Emergency Savings"
  },
  {
    "value": "travel_credit_card",
    "display": "Travel Credit Card"
  },
  {
    "value": "cash_wallet",
    "display": "Cash Wallet"
  },
  {
    "value": "investment_account",
    "display": "Investment Account"
  }
]

const actions = slice.actions
function Transactions() {

  const dispatch = useDispatch()
  const {searchTransaction} = useSelector((store) => {
    return store.sliceState
  })

  return (
    <div>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Transactions</h1>
          <p className='text-[14px] text-[#3B3F40]'>Track and manage all your financial transactions.</p>
        </div>
        <div>
          <button className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Transaction</button>
        </div>
      </div>

      <div className='flex justify-between mb-5 gap-4'>
        <div className='bg-[#FFFAF4] w-[33%] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-[#3A3A3A] text-[18px]'>Total Transactions</h1>
            </div>
            <h1 className='text-[25px] font-[600]'>10</h1>
            <p className='text-[14px] text-gray-500'>Filtered Results</p>
        </div>
        <div className='bg-[#FFFAF4] w-[33%] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-green-600 text-[18px]'>Total Income</h1>
            </div>
            <h1 className='text-[25px] text-green-600 font-[700]'>₹5,375.5</h1>
            <p className='text-[14px] text-gray-500'>From Filtered Transactions</p>
        </div>
        <div className='bg-[#FFFAF4] w-[33%] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-red-600 text-[18px]'>Total Expenses</h1>
            </div>
            <h1 className='text-[25px] font-[600]'>₹417.99</h1>
            <p className='text-[14px] text-gray-500'>From Filtered Transactions</p>
        </div>
      </div>

      <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
        <div className='text-[#3A3A3A] flex items-center mb-2'>
            <CiFilter size={20} strokeWidth={1}/>
            <h1 className='text-[20px] font-[600] ml-2'>Search & Filter</h1>
        </div>
        <div className='flex flex-wrap justify-between gap-4'>
            <div className='flex items-center p-2 rounded shadow focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200'>
                <CiSearch/> 
                <input className='ml-3 outline-none w-[200px]' placeholder='Search Transactions...' value={searchTransaction} onChange={(event) => dispatch(actions.setSearchTransaction(event.target.value))}/>
            </div>
            <div className="relative inline-block w-44 rounded-md border border-gray-300 p-2 text-sm font-medium text-gray-700 shadow-sm">
                <select className="w-38 focus:outline-none cursor-pointer" defaultValue="all">
                    {
                        transactionTypes.map((each) => (
                            <option value={each.value}>{each.display}</option>
                        ))
                    }
                </select>
            </div>
            <div className="relative inline-block w-44 rounded-md border border-gray-300 p-2 text-sm font-medium text-gray-700 shadow-sm">
                <select className="w-38 focus:outline-none cursor-pointer" defaultValue="all">
                    {
                        categoryTypes.map((each) => (
                            <option value={each.value}>{each.display}</option>
                        ))
                    }
                </select>
            </div>
            <div className="relative inline-block w-44 rounded-md border border-gray-300 p-2 text-sm font-medium text-gray-700 shadow-sm">
                <select className="w-38 focus:outline-none cursor-pointer border-gray-300" defaultValue="all">
                    {
                        accountTypes.map((each) => (
                            <option value={each.value}>{each.display}</option>
                        ))
                    }
                </select>
            </div>
            <button className='p-2 w-35 bg-white rounded-md border border-gray-300 p-2 text-sm font-medium text-gray-700 shadow-sm cursor-pointer'>clear filters</button>
        </div>
      </div>

      <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
        <div className='mb-3'>
          <h1 className='text-[#3A3A3A] font-[600] text-[18px]'>Recent Transactions</h1>
          <p className='text-[15px] text-[#6D6C6A]'>Your latest financial activity</p>
        </div>
        <div className='space-y-4'>
          {
            mockTransactions.map((each) => (
              <div className='border-2 border-[#DDDFDE] rounded p-3 flex gap-4'>
                <div>
                  Icon
                </div>
                <div className='flex-1'>
                  <div className='flex gap-4 items-center'>
                    <h1 className='text-[#3A3A3A] text-[18px] font-[500]'>{each.description}</h1>
                    <button className='text-[#9F0712] text-[11px] border py-[1px] px-2 rounded'>{each.type}</button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <ul className='flex gap-10'>
                        <p className='text-[#494847] text-[15px]'>{each.category}</p>
                        <li className='text-[#494847] text-[15px] list-disc'>{each.account}</li>
                        <li className='text-[#494847] text-[15px] list-disc'>{each.date}</li>
                      </ul>
                      <p className='text-[#494847] text-[15px]'>{each.notes}</p>
                    </div>
                    <p className='text-[20px]'>{each.amount}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Transactions

import React from 'react'
import {IoWalletOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import PieChartCategory from "./PieChartCategory"
import  BarChartInVsEx  from './BarChartInVsEx';
import { useSelector,useDispatch } from 'react-redux';
import { categoryIcons,accountIcons } from './Utilities';
import {ArrowBigRight} from "lucide-react"
import { TransactionModal } from './AddModals';
import slice from '../redux/slices';

const actions = slice.actions
function DashBoard() {
  const dispatch = useDispatch()
  const {transactionList,accountList,isTransactionModalOpen} = useSelector((store) => {
    return store.sliceState
  })

  const accounts = accountList.filter((each) => each.balance > 0).slice(0,3)

  const transactions = transactionList.slice(0,5)

  const currentMonth = new Date().getMonth();
  let income = 0, expenses = 0;

  transactionList.forEach(tx => {
    const month = new Date(tx.date).getMonth();
    if (month === currentMonth) {
      if (tx.transactionType === "Income") income += tx.amount;
      if (tx.transactionType === "Expense") expenses += tx.amount;
    }
  });
  return (
    <div>
      {isTransactionModalOpen && <TransactionModal/>}
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Dashboard</h1>
          <p className='text-[14px] text-[#3B3F40]'>Welcome back! Here's your financial overview.</p>
        </div>
        <div>
          <button onClick={()=>dispatch(actions.setIsTransactionModalOpen())} className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Transaction</button>
        </div>
      </div>
      <div className='flex justify-between mb-3'>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Balance</p>
            <IoWalletOutline size={20} color='#505050' />
          </div>
          <div>
            <h1 className='text-[25px] font-[600]'>₹{income-expenses}</h1>
            <p className='flex items-center text-[12px]'><FaArrowTrendUp color='green' />+12.5% from last month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Income</p>
            <p className='text-green-700'>↑</p>
          </div>
          <div>
            <h1 className='text-[25px] text-green-600 font-[600]'>₹{income}</h1>
            <p className='flex items-center text-[12px]'>This month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Expenses</p>
            <p className='text-red-600'>↓</p>
          </div>
          <div>
            <h1 className='text-[25px] text-red-600 font-[600]'>₹{expenses}</h1>
            <p className='flex items-center text-[12px]'>This month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Net Income</p>
            <FaArrowTrendUp/>
          </div>
          <div>
            <h1 className='text-[25px] text-green-600 font-[600]'>₹{income-expenses}</h1>
            <p className='flex items-center text-[12px]'>This month</p>
          </div>
        </div>
      </div>

      <div className='flex items-stretch gap-4 my-3'>
        <div className="flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl flex flex-col border-2 border-[#DDDFDE] ">
          <PieChartCategory/>
        </div>
        <div className="flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl flex flex-col border-2 border-[#DDDFDE]">
          <BarChartInVsEx />
        </div>
      </div>

      <div className='flex items-stretch gap-4'>
        <div className='flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl border-2 border-[#DDDFDE] p-4 flex flex-col'>
          <div>
            <h1 className="text-lg font-semibold text-gray-700">Account Overview</h1>
            <p className="text-[#8E5660]">Your account balances at a glance.</p>
          </div>
          <div className='my-3 space-y-2'>
            {
              accounts.map((acc,index) => {
                const IconComponent = accountIcons.find((eachIcon) => eachIcon.id === acc.icon)
                return (
                  <div key={index} className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-3 rounded-lg'>
                    <div className='flex'>
                      <div className='w-12 h-12 rounded-full mx-2 flex items-center justify-center' style={{backgroundColor: IconComponent.color}}>
                        <IconComponent.icon color='white'/>
                      </div>
                      <div>
                        <h1 className='text-[#433C3E] text-[20px]'>{acc.name}</h1>
                        <p className='text-[12px] text-gray-700'>{acc.accountType}</p>
                      </div>
                    </div>
                    <h1 className='text-green-700 text-[18px]'>₹{acc.balance}</h1>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className='flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl border-2 border-[#DDDFDE] p-4 flex flex-col'>
          <div>
            <h1 className="text-lg font-semibold text-gray-700">Recent Transactions</h1>
            <p className="text-[#8E5660]">Your Latest financial activity.</p>
          </div>
          <div className='my-3 space-y-1'>
            {
              transactions.map((each,index) => {
              let button
              let IconComponent = {icon: ArrowBigRight , color: "blue"}
              if(each.transactionType === "Expense")
                button = "text-white bg-red-500 text-[11px] border py-1 px-2 rounded"
              else if(each.transactionType === "Transfer")
                button = "text-white bg-blue-500 text-[11px] border py-1 px-2 rounded"
              else
                button = "text-white bg-green-500 text-[11px] border py-1 px-2 rounded"
              if (each.transactionType === "Income" || each.transactionType === "Expense")
                 IconComponent = categoryIcons.find((eachIcon) => eachIcon.id === each.categoryId.icon)
              return (
                <div key={index} className='border-2 border-[#DDDFDE] bg-white rounded p-3 flex gap-4 items-center'>
                  <div className='w-12 h-12 rounded-full mx-2 flex items-center justify-center' style={{backgroundColor: IconComponent.color}}>
                    <IconComponent.icon color='white'/>
                  </div>
                  <div className='flex items-center justify-between flex-1'>
                    <div>
                      <div className='flex gap-4 items-center'>
                        <h1 className='text-[#3A3A3A] text-[18px] font-[500]'>{each.description}</h1>
                        <p className={button}>{each.transactionType}</p>
                      </div>
                      <div>
                        { (each.transactionType === "Income" || each.transactionType === "Expense") ? 
                          <ul className='flex gap-5'>
                            <p className='text-[#494847] text-[12px]'>{each.categoryId.name}</p>
                            <li className='text-[#494847] text-[12px] list-disc'>{each.accountId.name}</li>
                            <li className='text-[#494847] text-[12px] list-disc'>{new Date(each.date).toDateString()}</li>
                          </ul>
                          : <ul className='flex gap-5'>
                              <p className='text-[#494847] text-[12px]'>From: {each.fromAccountId.name}</p>
                              <p className='text-[#494847] text-[12px]'>To: {each.toAccountId.name}</p>
                              <li className='text-[#494847] text-[12px] list-disc'>{new Date(each.date).toDateString()}</li>
                            </ul>
                        }
                        <p className='text-[#494847] text-[15px]'>{each.notes}</p>
                      </div>  
                    </div>
                    {each.transactionType === "Expense" ? 
                      <p className={`text-[22px] font-[500] text-red-600`}><span>- </span>₹{each.amount}</p> 
                      : <p className={`text-[22px] font-[500] ${each.transactionType==="Transfer" ? 'text-blue-600':'text-green-500'}`}>₹{each.amount}</p>
                    }
                  </div>
                </div>
              )
            })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
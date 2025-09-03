import React from 'react'
import ProgressBar from './ProgressBar'

const budgets = [
  {
    category: "Food & Dining",
    period: "Monthly",
    spent: 650.5,
    limit: 800,
    percentage: 81.3,
    status: "Near Limit",
    remaining: 149.5,
    remainingStatus: "positive",
  },
  {
    category: "Transportation",
    period: "Monthly",
    spent: 245.2,
    limit: 300,
    percentage: 81.7,
    status: "Near Limit",
    remaining: 54.8,
    remainingStatus: "positive",
  },
  {
    category: "Entertainment",
    period: "Monthly",
    spent: 215.99,
    limit: 200,
    percentage: 108.0,
    status: "Over Budget",
    remaining: -15.99, // negative means over budget
    remainingStatus: "negative",
  },
  {
    category: "Shopping",
    period: "Monthly",
    spent: 320,
    limit: 500,
    percentage: 64.0,
    status: "On Track",
    remaining: 180,
    remainingStatus: "positive",
  },
  {
    category: "Bills & Utilities",
    period: "Monthly",
    spent: 380,
    limit: 400,
    percentage: 95.0,
    status: "Near Limit",
    remaining: 20,
    remainingStatus: "positive",
  },
  {
    category: "Healthcare",
    period: "Monthly",
    spent: 85,
    limit: 150,
    percentage: 56.7,
    status: "On Track",
    remaining: 65,
    remainingStatus: "positive",
  },
];

const budgetAlerts = budgets.filter((each) => each.percentage > 80)

function Budgets() {
  return (
    <div>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Budgets</h1>
          <p className='text-[14px] text-[#3B3F40]'>Set spending limits and track your progress.</p>
        </div>
        <div>
          <button className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Budget</button>
        </div>
      </div>
      <div className='flex justify-between mb-5 gap-4'>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Budget</p>
          </div>
          <div>
            <h1 className='text-[25px] font-[600]'>₹2,350</h1>
            <p className='flex items-center text-[12px]'>Monthly Limit</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <p>Total Spent</p>
          <div>
            <h1 className='text-[25px] font-[600]'>₹1,896.69</h1>
            <div className='flex items-center gap-4'>
                <ProgressBar value={60} width={100}/>
                <p className='text-[12px]'>80% of budget</p>
            </div>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
            <p className='text-red-600'>Over Budget</p>
          <div>
            <h1 className='text-[25px] text-red-600 font-[600]'>1</h1>
            <p className='flex items-center text-[12px]'>Categories exceeded</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <p className='text-yellow-600'>Near Limit</p>
          <div>
            <h1 className='text-[25px] text-yellow-600 font-[600]'>3</h1>
            <p className='flex items-center text-[12px]'>Categories at 80%+</p>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 justify-between mb-3'>
        {
            budgets.map((each,index) => (
                <div key={index} className='bg-[#FFFAF4] w-[370px] p-4 border-2 border-[#DDDFDE] rounded-lg group shadow'>
                    <div className='flex gap-4 items-center mb-6'>
                        <p>Icon</p>
                        <div>
                            <h1 className='text-[18px] font-[500]'>{each.category}</h1>
                            <button className='text-gray-500 text-[11px] border py-[1px] px-2 rounded'>{each.period}</button>
                        </div>
                    </div>
                    <div className='flex justify-between mb-3'>
                      <div className='flex gap-2'>
                        <p>icon</p>
                        <p className='text-yellow-600'>{each.status}</p>
                      </div>
                      <p>{each.percentage}%</p>
                    </div>
                    <div className='mb-3'>
                      <ProgressBar value={each.percentage}/>
                    </div>
                    <div className='flex justify-between mb-3'>
                      <p className='text-yellow-500'>₹{each.spent}</p>
                      <p>₹{each.limit}</p>
                    </div>
                    <hr className='text-gray-400 mb-3'/>
                    <div className='flex justify-between'>
                      <p>Remaining:</p>
                      <p className='text-green-600'>₹{each.remaining}</p>
                    </div>
                </div>
            ))
        }
      </div>

      <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
        <div className='flex gap-4 items-center mb-5'>
          <p>Icon</p>
          <h1 className='text-[20px] font-[500]'>Budget Alerts</h1>
        </div>
        <div className='space-y-4'>
            {
              budgetAlerts.map((each) => (
                <div className='flex justify-between bg-white rounded-lg p-2'>
                  <div className='flex gap-4'>
                    <p>icon</p>
                    <h1 className='text-[18px] font-[400]'>{each.category}</h1>
                  </div>
                  <div>
                    <h1 className='text-yellow-500'>{each.remaining > 0 ? `${each.percentage}% of budget is used` : `₹${Math.abs(each.remaining)}  over budget`}</h1>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )
}

export default Budgets

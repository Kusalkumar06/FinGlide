import React from 'react'
import {IoWalletOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import PieChartCategory from './PieChartCategory';
import BarChartInVsEx from './BarChartInVsEx';

function DashBoard() {
  return (
    <div>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Dashboard</h1>
          <p className='text-[14px] text-[#3B3F40]'>Welcome back! Here's your financial overview.</p>
        </div>
        <div>
          <button className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Transaction</button>
        </div>
      </div>
      <div className='flex justify-between mb-3'>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Balance</p>
            <IoWalletOutline size={20} color='#505050' />
          </div>
          <div>
            <h1 className='text-[25px] font-[600]'>₹25,750.5</h1>
            <p className='flex items-center text-[12px]'><FaArrowTrendUp color='green' />+12.5% from last month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Income</p>
            <p className='text-green-700'>↑</p>
          </div>
          <div>
            <h1 className='text-[25px] text-green-600 font-[600]'>₹45,000</h1>
            <p className='flex items-center text-[12px]'>This month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Total Expenses</p>
            <p className='text-red-600'>↓</p>
          </div>
          <div>
            <h1 className='text-[25px] text-red-600 font-[600]'>₹19,249.5</h1>
            <p className='flex items-center text-[12px]'>This month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Net Income</p>
            <FaArrowTrendUp/>
          </div>
          <div>
            <h1 className='text-[25px] text-green-600 font-[600]'>₹25,750.5</h1>
            <p className='flex items-center text-[12px]'>This month</p>
          </div>
        </div>
      </div>

      <div className='flex items-stretch gap-4 my-3'>
        <div className="flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl flex flex-col border-2 border-[#DDDFDE]">
          <PieChartCategory/>
        </div>
        <div className="flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl flex flex-col border-2 border-[#DDDFDE]">
          <BarChartInVsEx/>
        </div>
      </div>

      <div className='flex items-stretch gap-4'>
        <div className='flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl border-2 border-[#DDDFDE] p-4 flex flex-col'>
          <div>
            <h1 className="text-lg font-semibold text-gray-700">Account Overview</h1>
            <p className="text-[#8E5660]">Your account balances at a glance.</p>
          </div>
          <div className='my-3 space-y-2'>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-3 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Checking Account</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-3 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Checking Account</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-3 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Checking Account</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
          </div>
        </div>

        <div className='flex-1 bg-[#FFFAF4] shadow-lg rounded-2xl border-2 border-[#DDDFDE] p-4 flex flex-col'>
          <div>
            <h1 className="text-lg font-semibold text-gray-700">Recent Transactions</h1>
            <p className="text-[#8E5660]">Your Latest financial activity.</p>
          </div>
          <div className='my-3 space-y-1'>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
            <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
              <div>
                <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
                <p className='text-[12px] text-gray-700'>Bank</p>
              </div>
              <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
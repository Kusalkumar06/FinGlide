import React from 'react'
import { CiCalendar } from "react-icons/ci";
import { FaArrowTrendUp,FaArrowTrendDown } from "react-icons/fa6";
import { useSelector,useDispatch } from 'react-redux';
import slice from '../redux/slices';
// import PieChartCategory from './PieChartCategory';
import {BarChartSpVsBud,AreaGraphAccount,PieChartCategory,LineChartInVsEx} from './ReportsTab';
import BarChartInVsEx from './BarChartInVsEx';

const reportTabs = [
  {
    "id": "OVERVIEW",
    "display": "Overview"
  },
  {
    "id": "CATEGORIES",
    "display": "Categories"
  },
  {
    "id": "TRENDS",
    "display": "Trends"
  },
  {
    "id": "ACCOUNTS",
    "display": "Accounts"
  }
]

const analysis = [
  {
    "id": "OVERVIEW",
    "display": <PieChartCategory/>
  },
  {
    "id": "CATEGORIES",
    "display": <BarChartSpVsBud/>
  },
  {
    "id": "TRENDS",
    "display": <BarChartInVsEx/>
  },
  {
    "id": "ACCOUNTS",
    "display": <AreaGraphAccount/>
  }
]

const actions = slice.actions

function Reports() {
  const dispatch = useDispatch()
  const {activeReportsTab} = useSelector((store) => {
    return store.sliceState
  })

  const analysisTab = analysis.filter((tab) => tab.id === activeReportsTab);
  return (
    <div>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Reports & Analytics</h1>
          <p className='text-[14px] text-[#3B3F40]'>Comprehensive insights into your financial data.</p>
        </div>
        <div className=''>
          <button className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>Export Report</button>
        </div>
      </div>
      
      <div className='flex justify-between mb-3 gap-4'>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p className='text-green-600'>Total Income</p>
            <FaArrowTrendUp size={20} color='green' />
          </div>
          <div>
            <h1 className='text-[25px] text-green-500 font-[600]'>₹54,000</h1>
            <p className='flex items-center text-[12px]'>Avg: ₹4,500/month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p className='text-red-600'>Total Expenses</p>
            <FaArrowTrendDown size={20} color='red' />
          </div>
          <div>
            <h1 className='text-[25px] text-red-600 font-[600]'>₹38,500</h1>
            <p className='flex items-center text-[12px]'>Avg: ₹3,208/month</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p className='text-yellow-600'>Net Income</p>
            <p className='text-yellow-600'>₹</p>
          </div>
          <div>
            <h1 className='text-[25px] text-yellow-600 font-[600]'>₹15,500</h1>
            <p className='flex items-center text-[12px]'>28.7% savings rate</p>
          </div>
        </div>
        <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
          <div className='flex justify-between items-center'>
            <p>Report Period</p>
            <CiCalendar/>
          </div>
          <div>
            <h1 className='text-[25px] font-[600]'>12 Months</h1>
            <p className='flex items-center text-[12px]'>Jan 2024 - Dec 2024</p>
          </div>
        </div>
      </div>

      <div className='flex justify-center my-5'>
        <div className='flex justify-between w-[800px] bg-[#FFFAF4] px-3 py-2 rounded-lg'>
          {
            reportTabs.map((tab,index) => (
              <button key={index} onClick={() => dispatch(actions.setReportsTab(tab.id))} className={`${activeReportsTab === tab.id && "bg-white shadow"} py-1 px-3 w-[45%] rounded`}>{tab.display}</button>
            ))
          }
        </div>
      </div>
      <div>
        {
          analysisTab[0].display
        }
        {
          activeReportsTab === "OVERVIEW" ? <LineChartInVsEx/> : ''
        }

      </div>
    </div>
  )
}

export default Reports

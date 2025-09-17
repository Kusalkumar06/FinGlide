import React from 'react'
import ProgressBar from './ProgressBar'
import { MdOutlineDelete,MdOutlineEdit } from "react-icons/md";
import { useSelector,useDispatch } from 'react-redux'
import slice from '../redux/slices';
import { BudgetModal } from './AddModals';
import { categoryIcons } from './Utilities';
import {TriangleAlert,CircleCheckBig,CircleX} from 'lucide-react'
import EmptyView from './EmptyView';
const actions = slice.actions
function Budgets() {
  const dispatch = useDispatch();
  const {isBudgetModalOpen,budgetList} = useSelector((store) => {
    return store.sliceState
  })



  const totalBudget = budgetList.reduce((a,b) => (a+b.limit),0)
  const totalSpent = budgetList.reduce((a,b) => (a+b.spent),0)
  const budgetAlerts = budgetList.filter((each) => each.percentage > 80)
  const spentPercent = ((totalSpent/totalBudget) *100).toFixed(2)
  const overBudgets = budgetList.filter((each) => each.percentage > 100).length

  return (
    <div>
      {isBudgetModalOpen && <BudgetModal/>}
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Budgets</h1>
          <p className='text-[14px] text-[#3B3F40]'>Set spending limits and track your progress.</p>
        </div>
        <div>
          <button onClick={() => dispatch(actions.setIsBudgetModalOpen())} className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Budget</button>
        </div>
      </div>
      {budgetList.length > 0 ? <div>
        <div className='flex justify-between mb-5 gap-4'>
          <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
            <div className='flex justify-between items-center'>
              <p>Total Budget</p>
            </div>
            <div>
              <h1 className='text-[25px] font-[600]'>₹{totalBudget}</h1>
              <p className='flex items-center text-[12px]'>Monthly Limit</p>
            </div>
          </div>
          <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
            <p>Total Spent</p>
            <div>
              <h1 className='text-[25px] font-[600]'>₹{totalSpent}</h1>
              <div className='flex items-center gap-4'>
                  <div className='w-[40%]'>
                    <ProgressBar value={spentPercent} />
                  </div>
                  <p className='text-[12px]'>{spentPercent}% of budget</p>
              </div>
            </div>
          </div>
          <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
              <p className='text-red-600'>Over Budget</p>
            <div>
              <h1 className='text-[25px] text-red-600 font-[600]'>{overBudgets}</h1>
              <p className='flex items-center text-[12px]'>Categories exceeded</p>
            </div>
          </div>
          <div className='w-[275px] flex flex-col gap-6 py-6 bg-[#FFFAF4] p-3 shadow border-1 border-[#DDDFDE] rounded-lg'>
            <p className='text-yellow-600'>Near Limit</p>
            <div>
              <h1 className='text-[25px] text-yellow-600 font-[600]'>{budgetAlerts.length}</h1>
              <p className='flex items-center text-[12px]'>Categories at 80%+</p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-4 mb-3'>
          {
              budgetList.map((each,index) => {
                const IconComponent = categoryIcons.find((eachIcon) => eachIcon.id === each.icon)
                console.log(IconComponent)
                return (
                    <div key={index} className='bg-[#FFFAF4] w-[370px] p-4 border-2 border-[#DDDFDE] rounded-lg group shadow'>
                      <div className='flex gap-4 items-center mb-6'>
                          <div className='w-12 h-12 rounded-full mx-2 flex items-center justify-center' style={{backgroundColor: IconComponent.color}}>
                            <IconComponent.icon color='white'/>
                          </div>
                          <div>
                              <h1 className='text-[18px] font-[500]'>{each.category}</h1>
                              <button className='text-gray-500 text-[11px] border py-[1px] px-2 rounded'>{each.period}</button>
                          </div>
                          <div className='opacity-0 group-hover:opacity-100 flex gap-4 ml-auto'>
                            <button className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'>
                              <MdOutlineEdit size={15}/>
                            </button>
                            <button className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'> 
                              <MdOutlineDelete size={17} />
                            </button>
                          </div>
                      </div>
                      <div className='flex justify-between mb-3'>
                        <div className='flex gap-2 items-center'>
                          {each.progress <= 80 ? <CircleCheckBig size={17} color='green'/> : <TriangleAlert size={17} className='text-yellow-600'/>}
                          {each.progress >= 100 && <CircleX size={17} color='red'/>}
                          {each.progress >= 100 ? 
                            <p className='text-red-500 text-[18px]'>Over Budget</p> :
                            <p className={`${each.progress <= 80 ? "text-green-500" : "text-yellow-500"} text-[18px]`}>{each.progress <= 80 ? "On Track" : "Near Limit"}</p>
                          }
                        </div>
                        <p>{each.progress.toFixed(2)}%</p>
                      </div>
                      <div className='mb-3'>
                        <ProgressBar value={each.progress}/>
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
                )
              })
          }
        </div>

        <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
          <div className='flex gap-4 items-center mb-5'>
            <TriangleAlert size={22} className='text-yellow-600'/>
            <h1 className='text-[20px] font-[500]'>Budget Alerts</h1>
          </div>
          <div className='space-y-4'>
              { budgetAlerts.length > 0 ? 
                budgetAlerts.map((each,index) => (
                  <div key={index} className='flex justify-between bg-white rounded-lg p-2'>
                    <div className='flex gap-4'>
                      <p>icon</p>
                      <h1 className='text-[18px] font-[400]'>{each.category}</h1>
                    </div>
                    <div>
                      <h1 className='text-yellow-500'>{each.remaining > 0 ? `${each.percentage}% of budget is used` : `₹${Math.abs(each.remaining)}  over budget`}</h1>
                    </div>
                  </div>
                )) : <div className='text-center'><p>All budgets are on track.</p></div>
              }
          </div>
        </div>
      </div> : 
      <div className='h-[500px] flex flex-col items-center justify-center '>
        <div className='w-[50%]'>
          <EmptyView message={"You haven’t set any budgets yet. Create a budget to track your spending."}/>
        </div>
      </div>}
    </div>
  )
}

export default Budgets

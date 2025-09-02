import React from 'react'
import { MdOutlineDelete,MdOutlineEdit } from "react-icons/md";
import { useSelector,useDispatch } from 'react-redux'
import slice from '../redux/slices'

const categories = [
  {
    "category_name": "Food & Dining",
    "category_type": "EXPENSE",
    "description": "Restaurants and groceries"
  },
  {
    "category_name": "Transportation",
    "category_type": "EXPENSE",
    "description": "Gas, public transport"
  },
  {
    "category_name": "Shopping",
    "category_type": "EXPENSE",
    "description": "Clothes, electronics"
  },
  {
    "category_name": "Entertainment",
    "category_type": "EXPENSE",
    "description": "Movies, games, hobbies"
  },
  {
    "category_name": "Bills & Utilities",
    "category_type": "EXPENSE",
    "description": "Electricity, water, internet"
  },
  {
    "category_name": "Healthcare",
    "category_type": "EXPENSE",
    "description": "Medical expenses"
  },
  {
    "category_name": "Travel",
    "category_type": "EXPENSE",
    "description": "Vacation and trips"
  },
  {
    "category_name": "Education",
    "category_type": "EXPENSE",
    "description": "Courses and books"
  },
  {
    "category_name": "Salary",
    "category_type": "INCOME",
    "description": "Monthly salary"
  },
  {
    "category_name": "Freelance",
    "category_type": "INCOME",
    "description": "Freelance work"
  },
  {
    "category_name": "Investment",
    "category_type": "INCOME",
    "description": "Investment returns"
  },
  {
    "category_name": "Side Business",
    "category_type": "INCOME",
    "description": "Business income"
  },
]

const categoriesTabs = {
  income: "INCOME",
  expense: "EXPENSE",
}

const actions = slice.actions

function Categories() {
  const dispatch = useDispatch()
  const {activeCategoryTab} = useSelector((store) => (
    store.sliceState
  ))

  const expenseButton = `${activeCategoryTab == "EXPENSE" ? "bg-white shadow" : ""} py-1 px-3 w-[45%] rounded`

  const incomeButton = `${activeCategoryTab == "INCOME" ? "bg-white shadow" : ""} py-1 px-3 w-[45%] rounded`

  const category_list = categories.filter((eachCate) => eachCate.category_type === activeCategoryTab)

  const inButton = 'text-[#9F0712] text-[11px] bg-[#DBFCE7] py-[1px] px-2 rounded'

  const exButton = 'text-[#9F0712] text-[11px] bg-[#FFE2E2] py-[1px] px-2 rounded'

  return (
    <div>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Categories</h1>
          <p className='text-[14px] text-[#3B3F40]'>Organize your income and expense categories.</p>
        </div>
        <div>
          <button className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Category</button>
        </div>
      </div>

      <div className='flex gap-4 my-5'>
        <div className='w-[50%] p-4 bg-[#FFFAF4] rounded-lg border-2 border-[#DDDFDE] shadow'>
          <div className='mb-5'>
            <h1 className='text-[20px] text-green-500 font-[500]'>Income Categories</h1>
            <p className='text-[#3A3A3A] text-[14px]'>Categories for tracking your income sources</p>
          </div>
          <div>
            <h1 className='text-[24px] font-[500]'>4</h1>
            <p className='text-[#3A3A3A] text-[14px]'>Active Categories</p>
          </div>
        </div>
        <div className='w-[50%] p-4 bg-[#FFFAF4] rounded-lg border-2 border-[#DDDFDE] shadow'>
          <div className='mb-5'>
            <h1 className='text-[20px] text-red-600 font-[500]'>Expense Categories</h1>
            <p className='text-[#3A3A3A] text-[14px]'>Categories for tracking your expenses</p>
          </div>
          <div>
            <h1 className='text-[24px] font-[500]'>8</h1>
            <p className='text-[#3A3A3A] text-[14px]'>Active Categories</p>
          </div>
        </div>
      </div>

      <div className='flex justify-center my-5'>
        <div className='flex justify-between w-[800px] bg-[#FFFAF4] px-3 py-2 rounded-lg'>
          <button className={expenseButton} onClick={() => dispatch(actions.toggleCategoryTab(categoriesTabs.expense))}>Expense Categories</button>
          <button className={incomeButton} onClick={() => dispatch(actions.toggleCategoryTab(categoriesTabs.income))}>Income Categories</button>
        </div>
      </div>

      <div className='flex flex-wrap gap-4'>
        {
          category_list.map(category => (
            <div className='bg-[#FFFAF4] w-[380px] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
              <div className='mb-5 flex justify-between items-center'>
                <div>
                  <h1 className='text-[20px] font-[500] text-[#3A3A3A]'>{category.category_name}</h1>
                  <button className={category.category_type === "EXPENSE" ? exButton : inButton}>{category.category_type === "EXPENSE" ? "Expense" : "Income"}</button>
                </div>
                <div className='opacity-0 group-hover:opacity-100 flex gap-4'>
                  <button className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'>
                    <MdOutlineEdit size={15}/>
                  </button>
                  <button className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'> 
                    <MdOutlineDelete size={17} />
                  </button>
                </div>
              </div>
              <p className='text-[#3A3A3A]'>{category.description}</p>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Categories

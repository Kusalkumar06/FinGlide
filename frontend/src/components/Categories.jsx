import React from 'react'
import { MdOutlineDelete,MdOutlineEdit } from "react-icons/md";
import { useSelector,useDispatch } from 'react-redux'
import slice from '../redux/slices'
import axios from "axios"
import { useEffect } from 'react';
import { CategoryModal } from './AddModals';
import { categoryIcons } from './Icons';
import { EditCategoryModal } from './EditModals';


const categoriesTabs = {
  income: "Income",
  expense: "Expense",
}

const actions = slice.actions

function Categories() {
  const dispatch = useDispatch()
  const {activeCategoryTab,categoryList,isCategoryModalOpen,editCategory} = useSelector((store) => (
    store.sliceState
  ))

  const fetchCategories = () => {
    const fn = async () => {
      const url = "http://localhost:5000/category/getCategories/"
      const response = await axios.get(url,{withCredentials:true})
      console.log(response.data.Categories)
      dispatch(actions.setCategoryList(response.data.Categories))
    }
    fn()
  }
  useEffect(fetchCategories,[])

  const expenseButton = `${activeCategoryTab == "Expense" ? "bg-white shadow" : ""} py-1 px-3 w-[45%] rounded`

  const incomeButton = `${activeCategoryTab == "Income" ? "bg-white shadow" : ""} py-1 px-3 w-[45%] rounded`

  const category_list = (categoryList || []).filter((eachCate) => eachCate.categoryType === activeCategoryTab)

  const inButton = 'text-[#9F0712] text-[11px] bg-[#DBFCE7] py-[1px] px-2 rounded'

  const exButton = 'text-[#9F0712] text-[11px] bg-[#FFE2E2] py-[1px] px-2 rounded'

  const deleteCategory = async(id) => {
    const url = `http://localhost:5000/category/delete/${id}`
    console.log(url)
    await axios.delete(url,{withCredentials:true})
    const categories = await axios.get(`http://localhost:5000/category/getCategories/`,{withCredentials:true})

    dispatch(actions.setCategoryList(categories.data.Categories))
  }
  return (
    <div>
      {isCategoryModalOpen && <CategoryModal/>}
      
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Categories</h1>
          <p className='text-[14px] text-[#3B3F40]'>Organize your income and expense categories.</p>
        </div>
        <div>
          <button onClick={() => dispatch(actions.setIsCategoryModalOpen())} className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Category</button>
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

      <div className='flex flex-wrap gap-4 justify-between'>
        {
          category_list.map((category,index) => {

            const IconComponent = categoryIcons.find((eachIcon) => eachIcon.id === category.icon)
            return (
              <div key={index} className='bg-[#FFFAF4] w-[380px] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
                <div className='mb-5 flex justify-between items-center'>
                  <div className='flex gap-4 items-center'>
                    <div className='w-12 h-12 rounded-full mx-2 flex items-center justify-center' style={{backgroundColor: IconComponent.color}}>
                      <IconComponent.icon color='white'/>
                    </div>
                    <div>
                      <h1 className='text-[20px] font-[500] text-[#3A3A3A]'>{category.name}</h1>
                      <button className={category.categoryType === "Expense" ? exButton : inButton}>{category.categoryType === "Expense" ? "Expense" : "Income"}</button>
                    </div>
                  </div>
                  <div className='opacity-0 group-hover:opacity-100 flex gap-4'>
                    <button onClick={() => dispatch(actions.setEditCategory(category))} className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'>
                      <MdOutlineEdit size={15}/>
                    </button>
                    <button onClick={() => deleteCategory(category._id)} className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'> 
                      <MdOutlineDelete size={17} />
                    </button>
                  </div>
                </div>
                <p className='text-[#3A3A3A]'>{category.description && category.description}</p>
              </div>
          )})
        }
      </div>

      {editCategory && <EditCategoryModal category={editCategory}/>}

    </div>
  )
}

export default Categories

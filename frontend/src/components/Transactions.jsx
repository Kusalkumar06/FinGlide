import React from 'react'
import { CiFilter,CiSearch } from "react-icons/ci";
import { useSelector,useDispatch } from 'react-redux';
import slice from '../redux/slices';
import { categoryIcons } from './Utilities';
import { TransactionModal } from './AddModals';
import Select from "react-select"
import { ArrowBigRight } from "lucide-react";
import { HiArrowRightCircle,HiArrowLeftCircle } from "react-icons/hi2";


const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#F96C4A' : 'white',
      color: state.isFocused ? 'white' : "black",
      cursor: 'pointer', 
      borderRadius: '6px',
      ":active": {
        ...provided[":active"],
        backgroundColor: "#F96C4A", 
      },
    }),
    control: (provided,state) => ({
      ...provided,
      boxShadow: "none",
      outline: "none",
      borderColor: state.isFocused ? "#999" : "#ccc",
      "&:hover": { borderColor: "#999" },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      padding: '4px',
    }),
};



const actions = slice.actions
function Transactions() {

  const dispatch = useDispatch()
  const {transactionList,isTransactionModalOpen,categoryList,accountList,filterOptions,pageNum} = useSelector((store) => {
    return store.sliceState
  })

  const transactionTypes = [{value: "All",label: "All Types"},{value: "Expense",label: "Expense"},{value: "Income",label: "Income"},{value: "Transfer",label: "Transfer"}]
  const categoryTypes = [{value: "All",label: "All Categories"},...categoryList.map((category) => {
      return {
        label: category.name,
        value: category._id.toString()
      }
  })]
  const accountTypes = [{value: "All",label: "All Accounts"},...accountList.map((account) => {
    return {
      label: account.name,
      value: account._id.toString()
    }
  })]

  console.log(filterOptions)

  let transactions = transactionList.filter((each) => (each.description.toLowerCase()).includes(filterOptions.searchTransaction.toLowerCase()))
  if (filterOptions.searchAccount !== "All"){
    transactions = transactions.filter((each) => (each.accountId?._id.toString() === filterOptions.searchAccount || each.fromAccountId?._id.toString() === filterOptions.searchAccount || each.toAccountId?._id.toString() === filterOptions.searchAccount))
  }
  if (filterOptions.searchTransactionType !== "All"){
    transactions = transactions.filter((each) => each.transactionType === filterOptions.searchTransactionType)
  }
  if (filterOptions.searchCategory !== "All"){
    transactions = transactions.filter((each) => each.categoryId?._id === filterOptions.searchCategory)
  }

  const clearFilters = () => {
    dispatch(actions.setFilterOptions({
        searchTransaction: '',
        searchAccount: 'All',
        searchTransactionType: "All",
        searchCategory: "All"
      }))
  }


  const trasactionsCount = transactions.length
  const totalIncome = transactions.filter(each => each.transactionType === "Income").reduce((a,b) => (a+b.amount),0)
  const totalExpense = transactions.filter(each => each.transactionType === "Expense").reduce((a,b) => (a+b.amount),0)

  const totalPages = Math.ceil(transactions.length/6);
  let startIndex = (pageNum -1)*6;
  let endIndex = startIndex + 6

  const filterTransactions = transactions.slice(startIndex,endIndex);

  return (
    <div>
      {isTransactionModalOpen && <TransactionModal/> }
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Transactions</h1>
          <p className='text-[14px] text-[#3B3F40]'>Track and manage all your financial transactions.</p>
        </div>
        <div>
          <button onClick={() => dispatch(actions.setIsTransactionModalOpen())} className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Transaction</button>
        </div>
      </div>

      <div className='flex justify-between mb-5 gap-4'>
        <div className='bg-[#FFFAF4] w-[33%] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-[#3A3A3A] text-[18px]'>Total Transactions</h1>
            </div>
            <h1 className='text-[25px] font-[600]'>{trasactionsCount}</h1>
            <p className='text-[14px] text-gray-500'>Filtered Results</p>
        </div>
        <div className='bg-[#FFFAF4] w-[33%] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-green-600 text-[18px]'>Total Income</h1>
            </div>
            <h1 className='text-[25px] text-green-600 font-[500]'>₹{totalIncome}</h1>
            <p className='text-[14px] text-gray-500'>From Filtered Transactions</p>
        </div>
        <div className='bg-[#FFFAF4] w-[33%] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-red-600 text-[18px]'>Total Expenses</h1>
            </div>
            <h1 className='text-[25px] text-red-500 font-[500]'>₹{totalExpense}</h1>
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
                <input className='ml-3 outline-none w-[200px]' placeholder='Search Transactions...' value={filterOptions.searchTransaction} onChange={(event) => dispatch(actions.setFilterOptionsField({ field: "searchTransaction", value: event.target.value }))}/>
            </div>
                <Select className='w-44' value={transactionTypes.find(opt => opt.value === filterOptions.searchTransactionType) || null} onChange={(option) => dispatch(actions.setFilterOptionsField({ field: "searchTransactionType", value: option.value }))} options={transactionTypes} styles={customStyles}  defaultValue={transactionTypes[0]} maxMenuHeight={150}/>
                <Select className='w-44' value={categoryTypes.find(opt => opt.value === filterOptions.searchCategory) || null} onChange={(option) => dispatch(actions.setFilterOptionsField({ field: "searchCategory", value: option.value }))} options={categoryTypes} styles={customStyles}  defaultValue={categoryTypes[0]} maxMenuHeight={150}/>
                <Select className='w-44' value={accountTypes.find(opt => opt.value === filterOptions.searchAccount)} onChange={(option) => dispatch(actions.setFilterOptionsField({ field: "searchAccount", value: option.value }))} options={accountTypes} styles={customStyles}  defaultValue={accountTypes[0]} maxMenuHeight={150}/>
            <button onClick={clearFilters} className='p-2 w-35 bg-white rounded-md border border-gray-300 p-2 text-sm font-medium text-gray-700 shadow-sm cursor-pointer'>clear filters</button>
        </div>
      </div>

      <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
        <div className='mb-3'>
          <h1 className='text-[#3A3A3A] font-[600] text-[18px]'>Recent Transactions</h1>
          <p className='text-[15px] text-[#6D6C6A]'>Your latest financial activity</p>
        </div>
        <div className='space-y-4 mb-4'>
          {
            filterTransactions.map((each,index) => {
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
                          <ul className='flex gap-10'>
                            <p className='text-[#494847] text-[15px]'>{each.categoryId.name}</p>
                            <li className='text-[#494847] text-[15px] list-disc'>{each.accountId.name}</li>
                            <li className='text-[#494847] text-[15px] list-disc'>{new Date(each.date).toDateString()}</li>
                          </ul>
                          : <ul className='flex gap-10'>
                              <p className='text-[#494847] text-[15px]'>From: {each.fromAccountId.name}</p>
                              <p className='text-[#494847] text-[15px] list-disc'>To: {each.toAccountId.name}</p>
                              <li className='text-[#494847] text-[15px] list-disc'>{new Date(each.date).toDateString()}</li>
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
        
        <div className="flex justify-center items-center mb-[30px] md:mb-[50px]">
          {pageNum > 1 && (
              <HiArrowLeftCircle size={24} onClick={() => dispatch(actions.setPageNum(pageNum - 1))} className='cursor-pointer'/>
          )}
          <p className="mx-5">{pageNum} / {totalPages}</p>
          {pageNum < 5 && (
            <HiArrowRightCircle size={24} onClick={() => dispatch(actions.setPageNum(pageNum + 1))} className='cursor-pointer'/>
          )}
        </div>
      </div>
    </div>
  )
}

export default Transactions

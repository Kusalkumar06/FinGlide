import React from 'react'
import { CiFilter,CiSearch } from "react-icons/ci";
import { useSelector,useDispatch } from 'react-redux';
import slice from '../redux/slices';
import { categoryIcons } from './Utilities';
import { TransactionModal } from './AddModals';
import Select from "react-select"
import { ArrowBigRight } from "lucide-react";
import { HiArrowRightCircle,HiArrowLeftCircle } from "react-icons/hi2";
import { MdOutlineDelete,MdOutlineEdit } from "react-icons/md";
import api from '../api/axios'; 
import EmptyView from './EmptyView';


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

  const deleteTransaction = async(id) => {
    const url = `/transaction/delete/${id}`
    await api.delete(url,{withCredentials:true})

    const updatedTransactions = await api.get(`/transaction/getTransactions/`,{withCredentials:true})

    dispatch(actions.setTransactionList(updatedTransactions.data.transactions))
  }

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
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-2xl sm:text-[28px] font-[500]'>Transactions</h1>
          <p className='text-[14px] text-[#3B3F40]'>Track and manage all your financial transactions.</p>
        </div>
        <div>
          <button onClick={() => dispatch(actions.setIsTransactionModalOpen())} className='bg-[#D96D38] text-white text-base sm:text-[18px] p-2 rounded px-5 cursor-pointer hover:bg-[#e05a38] transition-colors whitespace-nowrap'>+ Add Transaction</button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-5'>
        <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-[#3A3A3A] text-[18px]'>Total Transactions</h1>
            </div>
            <h1 className='text-[25px] font-[600]'>{trasactionsCount}</h1>
            <p className='text-[14px] text-gray-500'>Filtered Results</p>
        </div>
        <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-green-600 text-[18px]'>Total Income</h1>
            </div>
            <h1 className='text-[25px] text-green-600 font-[500]'>₹{totalIncome}</h1>
            <p className='text-[14px] text-gray-500'>From Filtered Transactions</p>
        </div>
        <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-6'>
                <h1 className='text-red-600 text-[18px]'>Total Expenses</h1>
            </div>
            <h1 className='text-[25px] text-red-500 font-[500]'>₹{totalExpense}</h1>
            <p className='text-[14px] text-gray-500'>From Filtered Transactions</p>
        </div>
      </div>

      <div className='bg-[#FFFAF4] p-4 sm:p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
        <div className='text-[#3A3A3A] flex items-center mb-3'>
            <CiFilter size={20} strokeWidth={1}/>
            <h1 className='text-[18px] sm:text-[20px] font-[600] ml-2'>Search & Filter</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3'>
            <div className='flex items-center p-2 rounded shadow bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 sm:col-span-2 lg:col-span-1 xl:col-span-2'>
                <CiSearch className='shrink-0'/> 
                <input className='ml-3 outline-none w-full min-w-0' placeholder='Search Transactions...' value={filterOptions.searchTransaction} onChange={(event) => dispatch(actions.setFilterOptionsField({ field: "searchTransaction", value: event.target.value }))}/>
            </div>
            <Select className='min-w-0' value={transactionTypes.find(opt => opt.value === filterOptions.searchTransactionType) || null} onChange={(option) => dispatch(actions.setFilterOptionsField({ field: "searchTransactionType", value: option.value }))} options={transactionTypes} styles={customStyles} defaultValue={transactionTypes[0]} maxMenuHeight={150}/>
            <Select className='min-w-0' value={categoryTypes.find(opt => opt.value === filterOptions.searchCategory) || null} onChange={(option) => dispatch(actions.setFilterOptionsField({ field: "searchCategory", value: option.value }))} options={categoryTypes} styles={customStyles} defaultValue={categoryTypes[0]} maxMenuHeight={150}/>
            <Select className='min-w-0' value={accountTypes.find(opt => opt.value === filterOptions.searchAccount)} onChange={(option) => dispatch(actions.setFilterOptionsField({ field: "searchAccount", value: option.value }))} options={accountTypes} styles={customStyles} defaultValue={accountTypes[0]} maxMenuHeight={150}/>
            <button onClick={clearFilters} className='p-2 bg-white rounded-md border border-gray-300 text-sm font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors'>Clear Filters</button>
        </div>
      </div>

      <div className='bg-[#FFFAF4] p-5 border-2 border-[#DDDFDE] rounded-lg shadow mb-5'>
        <div className='mb-3'>
          <h1 className='text-[#3A3A3A] font-[600] text-[18px]'>Recent Transactions</h1>
          <p className='text-[15px] text-[#6D6C6A]'>Your latest financial activity</p>
        </div>
        {filterTransactions.length > 0 ? <div className='space-y-4 mb-4'>
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
                <div key={index} className='border-2 border-[#DDDFDE] bg-white rounded p-3 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center group'>
                  <div className='w-12 h-12 rounded-full flex items-center justify-center shrink-0' style={{backgroundColor: IconComponent.color}}>
                    <IconComponent.icon color='white'/>
                  </div>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-2 min-w-0'>
                    <div className='min-w-0'>
                      <div className='flex flex-wrap gap-2 sm:gap-4 items-center mb-1'>
                        <h1 className='text-[#3A3A3A] text-base sm:text-[18px] font-[500] break-words'>{each.description}</h1>
                        <p className={button}>{each.transactionType}</p>
                      </div>
                      <div className='min-w-0'>
                        { (each.transactionType === "Income" || each.transactionType === "Expense") ? 
                          <ul className='flex flex-wrap gap-2 sm:gap-4 lg:gap-10 text-sm sm:text-[15px]'>
                            <p className='text-[#494847]'>{each.categoryId.name}</p>
                            <li className='text-[#494847] list-disc'>{each.accountId.name}</li>
                            <li className='text-[#494847] list-disc'>{new Date(each.date).toDateString()}</li>
                          </ul>
                          : <ul className='flex flex-wrap gap-2 sm:gap-4 lg:gap-10 text-sm sm:text-[15px]'>
                              <p className='text-[#494847]'>From: {each.fromAccountId.name}</p>
                              <p className='text-[#494847]'>To: {each.toAccountId.name}</p>
                              <li className='text-[#494847] list-disc'>{new Date(each.date).toDateString()}</li>
                            </ul>
                        }
                        <p className='text-[#494847] text-sm sm:text-[15px] break-words'>{each.notes}</p>
                      </div>  
                    </div>
                    <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0'>
                      {each.transactionType === "Expense" ? 
                        <p className={`text-lg sm:text-[22px] font-[500] text-red-600 whitespace-nowrap`}><span>- </span>₹{each.amount}</p> 
                        : <p className={`text-lg sm:text-[22px] font-[500] ${each.transactionType==="Transfer" ? 'text-blue-600':'text-green-500'} whitespace-nowrap`}>₹{each.amount}</p>
                      }
                      <div className='opacity-100 sm:opacity-0 group-hover:opacity-100 flex gap-2'>
                        <button onClick={() => deleteTransaction(each._id)} className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors'> 
                          <MdOutlineDelete size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div> : <EmptyView message={"No transactions recorded yet."}/>}
        
        {
          totalPages > 1 && 
            <div className="flex justify-center items-center mb-[30px] md:mb-[50px]">
              {pageNum > 1 && (
                  <HiArrowLeftCircle size={24} onClick={() => dispatch(actions.setPageNum(pageNum - 1))} className='cursor-pointer'/>
              )}
              <p className="mx-5">{pageNum} / {totalPages}</p>
              {pageNum < totalPages && (
                <HiArrowRightCircle size={24} onClick={() => dispatch(actions.setPageNum(pageNum + 1))} className='cursor-pointer'/>
              )}
            </div>
        }
      </div>
    </div>
  )
}

export default Transactions

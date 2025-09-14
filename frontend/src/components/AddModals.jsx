import { useDispatch,useSelector } from "react-redux"
import slice from "../redux/slices"
const actions = slice.actions
import { MdOutlineCancel } from "react-icons/md";
import Select from 'react-select'
import { categoryIcons,accountIcons } from "./Utilities";
import axios from "axios";

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

export const CategoryModal = () => {
  const {isCategoryModalOpen,addCategoryForm} = useSelector((store) => {
   return  store.sliceState
  })
  
  const dispatch = useDispatch()
  const categoryTypeOptions = [{value: "Expense",label: "Expense"},{value: "Income",label: "Income"}]

  const handleSubmit = async(event) => {
    event.preventDefault();
  
    try{
      const categoryDetails = addCategoryForm
      
      const url = "http://localhost:5000/category/createCategory/";
      await axios.post(url,categoryDetails,{withCredentials:true})
    
      const updatedCategories = await axios.get("http://localhost:5000/category/getCategories/",{withCredentials:true})
      dispatch(actions.setCategoryList(updatedCategories.data.Categories))
      dispatch(actions.setIsCategoryModalOpen())
      
    }catch(err){
      console.error(`Error during adding the category.`,err)   
    }
  }

    return(
      <div>
        {isCategoryModalOpen && (
        <div className=" fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-[480px] p-5 rounded-lg">
            <div className="mb-6 flex justify-between">
              <div>
                <h1 className="text-[#3A3A3A] font-[500] text-[23px]">Add New Category</h1>
                <p className="text-[#5A5A5A] text-[14px]">Create a new category to organize your transactions.</p>
              </div>
              <MdOutlineCancel size={25} onClick={() => {dispatch(actions.setIsCategoryModalOpen());}}  className="self-start mt-3 cursor-pointer text-[#555B5A] hover:text-red-600" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Category Name</label>
                <input required value={addCategoryForm.name} onChange={(e) => dispatch(actions.setAddCategoryForm({ field: "name", value: e.target.value }))} type="text" placeholder="e.g., Food & Dining" className=" outline-none py-2 px-3 rounded shadow focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300" />
              </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Category type</label>
                <Select className='w-[50%]' value={categoryTypeOptions.find(opt => opt.value === addCategoryForm.categoryType) || null} onChange={(option) => dispatch(actions.setAddCategoryForm({ field: "categoryType", value: option.value }))} options={categoryTypeOptions} styles={customStyles}  defaultValue={categoryTypeOptions[0]}/>
              </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Icon</label>
                <div className="flex overflow-auto py-2 px-2">
                  {categoryIcons.map((eachIcon,index) => {
                    const IconComponent = eachIcon.icon
                    const isSelected = eachIcon.id === addCategoryForm.icon

                    return (
                      <button key={index} type="button" onClick={() => dispatch(actions.setAddCategoryForm({ field: "icon", value: eachIcon.id }))} style={{background: eachIcon.color}}
                          className={`flex-shrink-0 w-12 h-12 rounded-full mx-2 flex items-center justify-center ${isSelected ? 'ring-2 ring-gray-500 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                          >
                              <IconComponent color="white"/>  
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Description <span className="text-[16px] font-[400]">(optional)</span></label>
                <textarea required value={addCategoryForm.description} onChange={(e) => dispatch(actions.setAddCategoryForm({ field: "description", value: e.target.value }))} type="text" placeholder="Brief description of this category" className="border-1 outline-none py-2 px-3 h-[100px] rounded shadow" />
              </div>
              <div className="flex justify-end">
                <button className="bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer">Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )
}

export const AccountModal = () => {
  const {isAccountModalOpen,addAccountForm} = useSelector((store) => {
   return  store.sliceState
  })
  
  const dispatch = useDispatch()
  const accountOptions = [
  { value: "wallet", label: "Wallet" },
  { value: "bank", label: "Bank" },
  { value: "card", label: "Card" },
  { value: "investment", label: "Investment" },
  { value: "crypto", label: "Crypto" },
  { value: "loan", label: "Loan" },
  { value: "creditCard", label: "Credit Card" }
];


  const handleSubmit = async(event) => {
    event.preventDefault();
  
    try{
      const accountDetails = addAccountForm
      console.log(accountDetails)
      
      const url = "http://localhost:5000/account/createAccount/";
      await axios.post(url,accountDetails,{withCredentials:true})
    
      const updatedCategories = await axios.get("http://localhost:5000/account/getAccounts/",{withCredentials:true})
      dispatch(actions.setAccountList(updatedCategories.data.accounts))
      dispatch(actions.setIsAccountModalOpen())
      
    }catch(err){
      console.error(`Error during adding the Account.`,err)   
    }
  }

    return(
      <div>
        {isAccountModalOpen && (
        <div className=" fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-[480px] p-5 rounded-lg">
            <div className="mb-3 flex justify-between">
              <div>
                <h1 className="text-[#3A3A3A] font-[500] text-[23px]">Add New Account</h1>
                <p className="text-[#5A5A5A] text-[14px]">Create a new financial account to track your money.</p>
              </div>
              <MdOutlineCancel size={25} onClick={() => {dispatch(actions.setIsAccountModalOpen());}}  className="self-start mt-3 cursor-pointer text-[#555B5A] hover:text-red-600" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account Name</label>
                <input required value={addAccountForm.name} onChange={(e) => dispatch(actions.setAddAccountForm({ field: "name", value: e.target.value }))} type="text" placeholder="e.g., Main Checking" className=" outline-none py-2 px-3 rounded shadow focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300" />
              </div>
              <div className="flex w-[100%] items-center justify-between mb-3">
                <div className="flex flex-col w-[45%]">
                  <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account type</label>
                  <Select value={accountOptions.find(opt => opt.value === addAccountForm.accountType) || null} onChange={(option) => dispatch(actions.setAddAccountForm({ field: "accountType", value: option.value }))} options={accountOptions} styles={customStyles}  defaultValue={accountOptions[0]} maxMenuHeight={200}/>
                </div>
                <div className="flex flex-col w-[45%]">
                  <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account Balance</label>
                  <input required value={addAccountForm.balance} onChange={(e) => dispatch(actions.setAddAccountForm({ field: "balance", value: e.target.value }))} type="number" placeholder="0.00" step={0.1} className="outline-none py-2 px-3 rounded shadow" />
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-1">Icon</label>
                <div className="flex overflow-auto py-2 px-2">
                  {accountIcons.map((eachIcon,index) => {
                    const IconComponent = eachIcon.icon
                    const isSelected = eachIcon.id === addAccountForm.icon

                    return (
                      <button key={index} type="button" onClick={() => dispatch(actions.setAddAccountForm({ field: "icon", value: eachIcon.id }))} style={{background: eachIcon.color}}
                          className={`flex-shrink-0 w-10 h-10 rounded-full mx-2 flex items-center justify-center ${isSelected ? 'ring-2 ring-gray-500 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                          >
                              <IconComponent color="white"/>  
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account Number <span className="text-[16px] font-[400]">(Optional)</span></label>
                <input value={addAccountForm.accountNumber} onChange={(e) => dispatch(actions.setAddAccountForm({ field: "accountNumber", value: e.target.value }))} type="text" placeholder="*****1234" className="border-1 border-gray-400 outline-none py-2 px-3 rounded shadow" />
              </div>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Institution <span className="text-[16px] font-[400]">(Optional)</span></label>
                <input value={addAccountForm.institution} onChange={(e) => dispatch(actions.setAddAccountForm({ field: "institution", value: e.target.value }))} type="text" placeholder="e.g., SBI Bank" className="border-1 border-gray-400 outline-none py-2 px-3 rounded shadow" />
              </div>
              <div className="flex justify-end">
                <button className="bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )
}

export const TransactionModal = () => {
  const {isTransactionModalOpen,addTransactionForm,categoryList,accountList} = useSelector((store) => {
   return  store.sliceState
  })
  console.log(addTransactionForm)
  const categoryOptions = categoryList.filter((category) => category.categoryType === addTransactionForm.transactionType).map((category) => {
      return {
        label: category.name,
        value: category._id.toString()
      }
  })

  const accountOptions = accountList.map((account) => {
    return {
      label: account.name,
      value: account._id.toString(),
    }
  })
  

  const dispatch = useDispatch()

  const handleSubmit = async(event) => {
    event.preventDefault();
  
    try{
      const transactionDetails = addTransactionForm
      console.log(transactionDetails)
      
      const url = "http://localhost:5000/transaction/createTransaction/";
      await axios.post(url,transactionDetails,{withCredentials:true})
    
      const updatedTransactions = await axios.get("http://localhost:5000/transaction/getTransactions/",{withCredentials:true})
      dispatch(actions.setTransactionList(updatedTransactions.data.transactions))
      dispatch(actions.setIsTransactionModalOpen())
      
    }catch(err){
      console.error(`Error during adding the Transaction.`,err)   
    }
  }

    return(
      <div>
        {isTransactionModalOpen && (
        <div className=" fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-[480px] p-5 rounded-lg">
            <div className="mb-6 flex justify-between">
              <div>
                <h1 className="text-[#3A3A3A] font-[500] text-[23px]">Add New Transaction</h1>
                <p className="text-[#5A5A5A] text-[14px]">Create a new category to organize your transactions.</p>
              </div>
              <MdOutlineCancel size={25} onClick={() => {dispatch(actions.setIsTransactionModalOpen());}}  className="self-start mt-3 cursor-pointer text-[#555B5A] hover:text-red-600" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Description</label>
                <input required value={addTransactionForm.description} onChange={(e) => dispatch(actions.setAddTransactionForm({ field: "description", value: e.target.value }))} type="text" placeholder="e.g., Grocery Store" className=" outline-none py-2 px-3 rounded shadow focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300" />
              </div>
              <div className='flex justify-center mb-5'>
                <div className='flex justify-between w-[800px]  px-3 py-2 rounded-lg text-center shadow border-1 border-gray-300'>
                  <div className={`${addTransactionForm.transactionType == "Income" ? "bg-green-500 shadow text-white" : ""} py-1 px-3 w-[45%] rounded cursor-pointer`} onClick={() => {dispatch(actions.setAddTransactionForm({ field: "transactionType", value: "Income" }));dispatch(actions.setAddTransactionForm({ field: "fromAccountId", value: null}));dispatch(actions.setAddTransactionForm({ field: "toAccountId", value: null}))}}>Income</div>
                  <div className={`${addTransactionForm.transactionType == "Expense" ? "bg-red-500 shadow text-white" : ""} py-1 px-3 w-[45%] rounded cursor-pointer`} onClick={() => {dispatch(actions.setAddTransactionForm({ field: "transactionType", value: "Expense" }));dispatch(actions.setAddTransactionForm({ field: "fromAccountId", value: null}));dispatch(actions.setAddTransactionForm({ field: "toAccountId", value: null}))}}>Expense</div>
                  <div className={`${addTransactionForm.transactionType == "Transfer" ? "bg-blue-500 shadow text-white" : ""} py-1 px-3 w-[45%] rounded cursor-pointer`} onClick={() => {dispatch(actions.setAddTransactionForm({ field: "transactionType", value: "Transfer" }));dispatch(actions.setAddTransactionForm({ field: "categoryId", value: null}));dispatch(actions.setAddTransactionForm({ field: "accountId", value: null}))}}>Transfer</div>
                </div>
              </div>
              { (addTransactionForm.transactionType === "Income" || addTransactionForm.transactionType === "Expense") && 
                <div className="flex w-[100%] items-center justify-between mb-3">
                  <div className="flex flex-col w-[45%]">
                    <label className="text-[#3A3A3A] font-[500] text-[18px]">Category</label>
                    <Select value={categoryOptions.find(opt => opt.value === addTransactionForm.categoryId) || null} onChange={(option) => dispatch(actions.setAddTransactionForm({ field: "categoryId", value: option.value }))} options={categoryOptions} styles={customStyles} maxMenuHeight={150}/>
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-[#3A3A3A] font-[500] text-[18px]">Account</label>
                    <Select value={accountOptions.find(opt => opt.value === addTransactionForm.accountId) || null} onChange={(option) => dispatch(actions.setAddTransactionForm({ field: "accountId", value: option.value }))} options={accountOptions} styles={customStyles} maxMenuHeight={150}/>
                  </div>
                </div>
              }
              { addTransactionForm.transactionType === "Transfer" && 
                <div className="flex w-[100%] items-center justify-between mb-3">
                  <div className="flex flex-col w-[45%]">
                    <label className="text-[#3A3A3A] font-[500] text-[18px]">From Account</label>
                    <Select value={accountOptions.find(opt => opt.value === addTransactionForm.fromAccountId) || null} onChange={(option) => dispatch(actions.setAddTransactionForm({ field: "fromAccountId", value: option.value }))} options={accountOptions} styles={customStyles} maxMenuHeight={150}/>
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-[#3A3A3A] font-[500] text-[18px]">To Account</label>
                    <Select value={accountOptions.find(opt => opt.value === addTransactionForm.toAccountId) || null} onChange={(option) => dispatch(actions.setAddTransactionForm({ field: "toAccountId", value: option.value }))} options={accountOptions} styles={customStyles} maxMenuHeight={150}/>
                  </div>
                </div>
              }
              <div className="flex flex-col">
                  <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Amount</label>
                  <input required value={addTransactionForm.amount} onChange={(e) => dispatch(actions.setAddTransactionForm({ field: "amount", value: e.target.value }))} type="number" placeholder="0.00" step={0.1} className="outline-none py-2 px-3 rounded shadow w-[80%] border-1 border-gray-300" />
                </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">notes <span className="text-[16px] font-[400]">(optional)</span></label>
                <textarea value={addTransactionForm.notes} onChange={(e) => dispatch(actions.setAddTransactionForm({ field: "notes", value: e.target.value }))} type="text" placeholder="Brief description of this category" className="border-1 border-gray-300 outline-none py-2 px-3 h-[70px] rounded shadow" />
              </div>
              <div className="flex justify-end">
                <button className="bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer">Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )
}

export const BudgetModal = () => {
  const {isBudgetModalOpen,addBudgetForm,categoryList,addBudgetCategoryError} = useSelector((store) => {
   return  store.sliceState
  })

  const dispatch = useDispatch()
  const categoryOptions = categoryList.filter((category) => category.categoryType === "Expense").map((category) => {
      return {
        label: category.name,
        value: category._id.toString()
      }
  })

  const periodOptions = [{value: "monthly",label: "Monthly"},{value: "yearly",label: "Yearly"},{value: "weekly",label: "Weekly"}]

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (addBudgetForm.categoryId === ""){
      dispatch(actions.setAddBudgetCategoryError(true))
      return;
    } else{
      dispatch(actions.setAddBudgetCategoryError(false))
    }
    try{
      const budgetDetails = addBudgetForm
      
      const url = "http://localhost:5000/budget/createBudget/";
      await axios.post(url,budgetDetails,{withCredentials:true})
    
      const updatedCategories = await axios.get("http://localhost:5000/budget/getBudgets/",{withCredentials:true})
      dispatch(actions.setBudgetList(updatedCategories.data.Budgets))
      dispatch(actions.setAddBudgetForm({categoryId: "",limit: 0.00,period: "monthly",}))
      dispatch(actions.setIsBudgetModalOpen())
    }catch(err){
      console.error(`Error during adding the Budget.`,err)
    }
  }

    return(
      <div>
        {isBudgetModalOpen && (
        <div className=" fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-[350px] p-5 rounded-lg">
            <div className="mb-6 flex justify-between">
              <div>
                <h1 className="text-[#3A3A3A] font-[500] text-[23px]">Add New Budget</h1>
                <p className="text-[#5A5A5A] text-[14px]">Create a new category to organize your transactions.</p>
              </div>
              <MdOutlineCancel size={25} onClick={() => {dispatch(actions.setIsBudgetModalOpen());dispatch(actions.setAddBudgetForm({categoryId: "",limit: 0.00,period: "monthly",}));dispatch(actions.setAddBudgetCategoryError(false))}}  className="self-start mt-3 cursor-pointer text-[#555B5A] hover:text-red-600" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Category type</label>
                <Select className='w-[100%]' value={categoryOptions.find(opt => opt.value === addBudgetForm.categoryId) || null} onChange={(option) => dispatch(actions.setAddBudgetModalFormField({ field: "categoryId", value: option.value }))} options={categoryOptions} styles={customStyles}  defaultValue={categoryOptions[0]} maxMenuHeight={150}/>
                {addBudgetCategoryError && <p className="text-red-600">*Please select a category.</p>}
              </div>
              <div className="flex flex-col w-[100%] mb-5">
                  <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Budget Limit</label>
                  <input required value={addBudgetForm.limit} onChange={(e) => dispatch(actions.setAddBudgetModalFormField({ field: "limit", value: e.target.value }))} type="number" placeholder="0.00" step={0.1} className="outline-none py-2 px-3 rounded shadow border-1 border-gray-300" />
                </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Period</label>
                <Select className='w-[100%]' value={periodOptions.find(opt => opt.value === addBudgetForm.period) || null} onChange={(option) => dispatch(actions.setAddBudgetModalFormField({ field: "period", value: option.value }))} options={periodOptions} styles={customStyles}  defaultValue={periodOptions[0]}/>
              </div>
              <div className="flex justify-end">
                <button className="bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer">Add Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )
}
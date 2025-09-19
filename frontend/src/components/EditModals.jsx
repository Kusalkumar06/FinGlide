import { useDispatch,useSelector } from "react-redux"
import slice from "../redux/slices"
const actions = slice.actions
import { MdOutlineCancel } from "react-icons/md";
import Select from 'react-select'
import { categoryIcons,accountIcons } from "./Utilities";
import axios from "axios";
import { useEffect } from "react";

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

export const EditCategoryModal = (props) => {
  const {category}= props
  const {editCategoryForm,editCategory} = useSelector((store) => {
    return  store.sliceState
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.setEntireEditCategoryForm({
      name: category.name,
      categoryType: category.categoryType,
      icon: category.icon,
      description: category.description,
    }))
  },[])

  const categoryTypeOptions = [{value: "Expense",label: "Expense"},{value: "Income",label: "Income"}]

  const handleEdit = async(event) => {
    event.preventDefault();
    try{
      const categoryDetails = editCategoryForm
      const url = `https://finglide.onrender.com/category/update/${category._id}`;
      await axios.put(url,categoryDetails,{withCredentials:true})

      const updatedCategories = await axios.get("https://finglide.onrender.com/category/getCategories/",{withCredentials:true})
      dispatch(actions.setCategoryList(updatedCategories.data.Categories))
      dispatch(actions.setEditCategory(null))
    }catch(err){
      console.error("Error during updating the category",err)
    }
    
  }

    return(
      <div>
        { editCategory && (
        <div className=" fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-[480px] p-5 rounded-lg">
            <div className="mb-6 flex justify-between">
              <div>
                <h1 className="text-[#3A3A3A] font-[500] text-[23px]">Edit Category</h1>
                <p className="text-[#5A5A5A] text-[14px]">Update your category information.</p>
              </div>
              <MdOutlineCancel size={25} onClick={() => {dispatch(actions.setEditCategory(null));}}  className="self-start mt-3 cursor-pointer text-[#555B5A] hover:text-red-600" />
            </div>
            <form onSubmit={handleEdit}>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Category Name</label>
                <input required value={editCategoryForm.name} onChange={(e) => dispatch(actions.setEditCategoryForm({ field: "name", value: e.target.value }))} type="text" placeholder="e.g., Food & Dining" className=" outline-none py-2 px-3 rounded shadow focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300" />
              </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Category type</label>
                <Select className='w-[50%]' value={categoryTypeOptions.find(opt => opt.value === editCategoryForm.categoryType) || null} onChange={(option) => dispatch(actions.setEditCategoryForm({ field: "categoryType", value: option.value }))} options={categoryTypeOptions} styles={customStyles}  defaultValue={categoryTypeOptions[0]}/>
              </div>
              <div className="flex flex-col mb-5">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-3">Icon</label>
                <div className="flex overflow-auto py-2 px-2">
                  {categoryIcons.map((eachIcon,index) => {
                    const IconComponent = eachIcon.icon
                    const isSelected = eachIcon.id === editCategoryForm.icon

                    return (
                      <button key={index} type="button" onClick={() => dispatch(actions.setEditCategoryForm({ field: "icon", value: eachIcon.id }))} style={{background: eachIcon.color}}
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
                <textarea required value={editCategoryForm.description} onChange={(e) => dispatch(actions.setEditCategoryForm({ field: "description", value: e.target.value }))} type="text" placeholder="Brief description of this category" className="border-1 outline-none py-2 px-3 h-[100px] rounded shadow" />
              </div>
              <div className="flex justify-end">
                <button className="bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer">Edit Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )
}

export const EditAccountModal = (props) => {
  const {editAccount} = props
  const {editAccountForm} = useSelector((store) => {
   return  store.sliceState
  })
  console.log(editAccount)
  
  const dispatch = useDispatch()
  const accountOptions = [
    { value: "wallet", label: "Wallet" },
    { value: "bank", label: "Bank" },
    { value: "card", label: "Card" },
    { value: "investment", label: "Investment" },
    { value: "crypto", label: "Crypto" },
    { value: "loan", label: "Loan" }
  ];

  useEffect(() => {
    dispatch(actions.setEntireEditAccountForm({
      name: editAccount.name,
      accountType: editAccount.accountType,
      balance:editAccount.balance,
      accountNumber:editAccount.accountNumber,
      icon: editAccount.icon,
      institution: editAccount.institution,
    }))
  },[])


  const handleSubmit = async(event) => {
    event.preventDefault();
  
    try{
      const accountDetails = editAccountForm
      console.log(accountDetails)
      
      const url = `https://finglide.onrender.com/account/update/${editAccount._id}`;
      await axios.put(url,accountDetails,{withCredentials:true})
    
      const updatedCategories = await axios.get("https://finglide.onrender.com/account/getAccounts/",{withCredentials:true})
      dispatch(actions.setAccountList(updatedCategories.data.accounts))
      dispatch(actions.setEditAccount(null))
      
    }catch(err){
      console.error(`Error during adding the category.`,err)   
    }
  }

    return(
      <div>
        {editAccount && (
        <div className=" fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-[480px] p-5 rounded-lg">
            <div className="mb-3 flex justify-between">
              <div>
                <h1 className="text-[#3A3A3A] font-[500] text-[23px]">Edit Account</h1>
                <p className="text-[#5A5A5A] text-[14px]">Create a new financial account to track your money.</p>
              </div>
              <MdOutlineCancel size={25} onClick={() => {dispatch(actions.setEditAccount(null));}}  className="self-start mt-3 cursor-pointer text-[#555B5A] hover:text-red-600" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account Name</label>
                <input required value={editAccountForm.name} onChange={(e) => dispatch(actions.setEditAccountForm({ field: "name", value: e.target.value }))} type="text" placeholder="e.g., Main Checking" className=" outline-none py-2 px-3 rounded shadow focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300" />
              </div>
              <div className="flex w-[100%] items-center justify-between mb-3">
                <div className="flex flex-col w-[45%]">
                  <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account type</label>
                  <Select value={accountOptions.find(opt => opt.value === editAccountForm.accountType) || null} onChange={(option) => dispatch(actions.setEditAccountForm({ field: "accountType", value: option.value }))} options={accountOptions} styles={customStyles}  defaultValue={accountOptions[0]}/>
                </div>
                <div className="flex flex-col w-[45%]">
                  <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Account Balance</label>
                  <input required value={editAccountForm.balance} onChange={(e) => dispatch(actions.setEditAccountForm({ field: "balance", value: e.target.value }))} type="number" placeholder="0.00" step={0.1} className="outline-none py-2 px-3 rounded shadow" />
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-1">Icon</label>
                <div className="flex overflow-auto py-2 px-2">
                  {accountIcons.map((eachIcon,index) => {
                    const IconComponent = eachIcon.icon
                    const isSelected = eachIcon.id === editAccountForm.icon

                    return (
                      <button key={index} type="button" onClick={() => dispatch(actions.setEditAccountForm({ field: "icon", value: eachIcon.id }))} style={{background: eachIcon.color}}
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
                <input value={editAccountForm.accountNumber} onChange={(e) => dispatch(actions.setEditAccountForm({ field: "accountNumber", value: e.target.value }))} type="text" placeholder="*****1234" className="border-1 border-gray-400 outline-none py-2 px-3 rounded shadow" />
              </div>
              <div className="flex flex-col mb-3">
                <label className="text-[#3A3A3A] font-[500] text-[18px] mb-2">Institution <span className="text-[16px] font-[400]">(Optional)</span></label>
                <input value={editAccountForm.institution} onChange={(e) => dispatch(actions.setEditAccountForm({ field: "institution", value: e.target.value }))} type="text" placeholder="e.g., SBI Bank" className="border-1 border-gray-400 outline-none py-2 px-3 rounded shadow" />
              </div>
              <div className="flex justify-end">
                <button className="bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer">Edit Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )
}
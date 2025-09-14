import React from 'react'
import { MdOutlineDelete,MdOutlineEdit } from "react-icons/md";
import axios from "axios"
import { useSelector,useDispatch } from 'react-redux'
import slice from '../redux/slices';
import { AccountModal } from './AddModals';
import { EditAccountModal } from './EditModals';
import { accountIcons } from './Utilities';

const actions = slice.actions

function Accounts() {
  const dispatch = useDispatch();
  const {accountList,isAccountModalOpen,editAccount} = useSelector((store) => {
    return store.sliceState
  })

  

  const deleteAccount = async(id) => {
    const url = `http://localhost:5000/account/delete/${id}`
    await axios.delete(url,{withCredentials:true})

    const accounts = await axios.get(`http://localhost:5000/account/getAccounts/`,{withCredentials:true})

    dispatch(actions.setAccountList(accounts.data.accounts))
  }

  const reducer = (a,b) => a+b.balance 
  const totalAmount = accountList.reduce(reducer,0); 


  return (
    <div>
      {isAccountModalOpen && <AccountModal/>}
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Accounts</h1>
          <p className='text-[14px] text-[#3B3F40]'>Manage your financial accounts and view balances.</p>
        </div>
        <div>
          <button onClick={() => dispatch(actions.setIsAccountModalOpen())} className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Account</button>
        </div>
      </div>

      <div  className='flex justify-between items-center bg-[#FFFAF4] rounded-lg shadow-lg p-4 border-2 border-[#DDDFDE] my-5' >
        <div>
          <h1 className='text-[#36353A] font-[500] text-[18px]'>Total Net Worth</h1>
          <p className='text-[#813C7F] text-[14px]'>Combined balance across all accounts</p>
        </div>
        <div>
          <h1 className='text-[#D66C39] text-[25px] font-[500]'>₹{totalAmount}</h1>
          <p className='text-[12px]'>Across {accountList.length} accounts</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 justify-between'>
        {
          accountList.map((account,index) => {
            const IconComponent = accountIcons.find((eachIcon) => eachIcon.id === account.icon)
            return(
            <div key={index} className='bg-[#FFFAF4] w-[380px] p-4 border-2 border-[#DDDFDE] rounded-lg group shadow'>
              <div className='mb-5 flex items-center justify-between'>
                <div className='flex gap-2'>
                  <div className='w-12 h-12 rounded-full mx-2 flex items-center justify-center' style={{backgroundColor: IconComponent.color}}>
                    <IconComponent.icon color='white'/>
                  </div>
                  <div>
                    <h1 className='text-[#3A3A3A] text-[18px] font-[500]'>{account.name}</h1>
                    <p className='text-[14px] text-[#3A3A3A]'>{account.accountType}</p>
                  </div>
                </div>
                <div className='opacity-0 group-hover:opacity-100 flex gap-4'>
                  <button onClick={() => dispatch(actions.setEditAccount(account))} className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'>
                    <MdOutlineEdit size={15}/>
                  </button>
                  <button onClick={() => deleteAccount(account._id)} className='hover:bg-[#D96D38] text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer'> 
                    <MdOutlineDelete size={17} />
                  </button>
                </div>
              </div>
              <div className='my-3'>
                <h1 className={`${account.balance >= 0 ? 'text-green-500' : 'text-red-500'} text-[22px] font-[500]`}>₹{account.balance}</h1>
                <p className='text-[14px] text-[#3A3A3A]'>Current Balance</p>
              </div>
              <hr className='my-3 text-gray-300'/>
              <div className='flex justify-between text-[#3A3A3A]'>
                <p>Account:</p>
                <p>{account.accountNumber}</p>
              </div>
              <div className='flex justify-between text-[#3A3A3A]'>
                <p>Institution:</p>
                <p>{account.institution}</p>
              </div>
            </div>
          )})
        }
      </div>
      {editAccount && <EditAccountModal editAccount={editAccount}/>}
    </div>
  )
}

export default Accounts

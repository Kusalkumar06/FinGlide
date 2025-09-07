import React from 'react'
import { MdOutlineDelete,MdOutlineEdit } from "react-icons/md";
import axios from "axios"
import { useSelector,useDispatch } from 'react-redux'
import { useEffect } from 'react';
import slice from '../redux/slices';

// const accountDetails = [
//   {
//     "accountName": "Main Checking",
//     "accountType": "Bank",
//     "currentBalance": 15750.50,
//     "lastFourDigits": "1234",
//     "institution": "Chase Bank"
//   },
//   {
//     "accountName": "Emergency Savings",
//     "accountType": "Bank",
//     "currentBalance": 8500.00,
//     "lastFourDigits": "5678",
//     "institution": "Wells Fargo"
//   },
//   {
//     "accountName": "Travel Credit Card",
//     "accountType": "Credit Card",
//     "currentBalance": -1500.00,
//     "lastFourDigits": "9802",
//     "institution": "American Express"
//   },
//   {
//     "accountName": "Cash Wallet",
//     "accountType": "Cash",
//     "currentBalance": 250.00,
//     "lastFourDigits": "N/A",
//     "institution": "Physical Cash"
//   },
//   {
//     "accountName": "Investment Account",
//     "accountType": "Investment",
//     "currentBalance": 12750.25,
//     "lastFourDigits": "3456",
//     "institution": "Fidelity"
//   }
// ]

const actions = slice.actions

function Accounts() {
  const dispatch = useDispatch();
  const {accountList} = useSelector((store) => {
    return store.sliceState
  })

  const fetchAccounts = () => {
    const fn = async () => {
      const url = "http://localhost:5000/account/getAccounts/"
      const response = await axios.get(url,{withCredentials:true})
      console.log(response.data.accounts)
      dispatch(actions.setAccountList(response.data.accounts))
    }
    fn()
  }
  useEffect(fetchAccounts,[])


  return (
    <div>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-[#3A3A3A] text-[28px] font-[500]'>Accounts</h1>
          <p className='text-[14px] text-[#3B3F40]'>Manage your financial accounts and view balances.</p>
        </div>
        <div>
          <button className='bg-[#D96D38] text-white text-[18px] p-1 rounded px-5 cursor-pointer'>+ Add Account</button>
        </div>
      </div>

      <div  className='flex justify-between items-center bg-[#FFFAF4] rounded-lg shadow-lg p-4 border-2 border-[#DDDFDE] my-5' >
        <div>
          <h1 className='text-[#36353A] font-[500] text-[18px]'>Total Net Worth</h1>
          <p className='text-[#813C7F] text-[14px]'>Combined balance across all accounts</p>
        </div>
        <div>
          <h1 className='text-[#D66C39] text-[25px] font-[500]'>₹35,750.75</h1>
          <p className='text-[12px]'>Across 5 accounts</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 justify-between'>
      {
        accountList.map((account,index) => (
          <div key={index} className='bg-[#FFFAF4] w-[380px] p-4 border-2 border-[#DDDFDE] rounded-lg group shadow'>
            <div className='mb-5 flex items-center justify-between'>
              <div className='flex gap-2'>
                <div className='flex items-center justify-center p-2 rounded-[50%] w-12' style={{backgroundColor: account.color}}>
                  <p>{account.icon}</p>
                </div>
                <div>
                  <h1 className='text-[#3A3A3A] text-[18px] font-[500]'>{account.name}</h1>
                  <p className='text-[14px] text-[#3A3A3A]'>{account.accountType}</p>
                </div>
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
            <div className='my-3'>
              <h1 className='text-green-500 text-[22px] font-[500]'>+₹{account.balance}</h1>
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
        ))
      }
      </div>
    </div>
  )
}

export default Accounts

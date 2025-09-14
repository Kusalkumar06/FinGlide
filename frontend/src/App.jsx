import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'
import DashBoard from './components/DashBoard'
import SideBar from './components/SideBar'
import Categories from './components/Categories'
import Accounts from './components/Accounts'
import Transactions from './components/Transactions'
import Budgets from './components/Budgets'
import Reports from './components/Reports'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import slice from './redux/slices'
import ProtectedRoute from './components/ProtectedRoute'


const actions = slice.actions
function App() {
  const dispatch = useDispatch()

  const fetchAllDetails = async() => {
    try{
      const [accountResponse,categoryResponse,transactionResponse,budgetResponse] = await Promise.all([
          axios.get("http://localhost:5000/account/getAccounts/",{withCredentials:true}),
          axios.get("http://localhost:5000/category/getCategories/",{withCredentials:true}),
          axios.get("http://localhost:5000/transaction/getTransactions/",{withCredentials:true}),
          axios.get("http://localhost:5000/budget/getBudgets/",{withCredentials:true})
      ])
      dispatch(actions.setAccountList(accountResponse.data.accounts))
      dispatch(actions.setCategoryList(categoryResponse.data.Categories))
      dispatch(actions.setTransactionList(transactionResponse.data.transactions))
      dispatch(actions.setBudgetList(budgetResponse.data.Budgets))
    } catch(err){
      console.log(`Error during fetching Details,Error: ${err}`)
    }
  }
  useEffect(() => { fetchAllDetails() },[dispatch])

  const fetchAllReportsDetails = async() => {
    try{
      const [pieDataResponse,lineDataResponse] = await Promise.all([
        axios.get("http://localhost:5000/category/getPieData/",{withCredentials:true}),
        axios.get("http://localhost:5000/transaction/yearlySummary/",{withCredentials:true})
      ])
      dispatch(actions.setPieData(pieDataResponse.data.transactionData))
      dispatch(actions.setLineData(lineDataResponse.data.summary))

      
    }catch(err){
      console.log(`Error during fetching Reports Details, Error: ${err}`)
    }
  }

  useEffect(() => {fetchAllReportsDetails()},[dispatch])
  

  return (
    <div>
      <Routes>
        <Route path='/' element={<SideBar/>}>
          <Route index element={<ProtectedRoute><DashBoard/></ProtectedRoute>}></Route>
          <Route path='/categories/' element={<ProtectedRoute><Categories/></ProtectedRoute>}></Route>
          <Route path='/accounts' element={<ProtectedRoute><Accounts/></ProtectedRoute>}></Route>
          <Route path='/transactions' element ={<ProtectedRoute><Transactions/></ProtectedRoute>}></Route>
          <Route path='/budgets' element ={<ProtectedRoute><Budgets/></ProtectedRoute>}></Route>
          <Route path='/reports' element ={<ProtectedRoute><Reports/></ProtectedRoute>}></Route>
        </Route>
        <Route path='/register/' element={<Signup />}></Route>
        <Route path='/login/' element={<Signin />}></Route>
      </Routes>
    </div>
  )
}

export default App

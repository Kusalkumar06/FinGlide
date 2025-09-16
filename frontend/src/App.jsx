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
import { useDispatch,useSelector } from 'react-redux'
import slice from './redux/slices'
import ProtectedRoute from './components/ProtectedRoute'


const actions = slice.actions
function App() {
  const dispatch = useDispatch()
  const {isUserLoggedIn} = useSelector((store) => {
    return store.sliceState
  })

  const fetchAllDetails = async() => {
    try{
      const [accountResponse,categoryResponse,transactionResponse,budgetResponse] = await Promise.all([
          axios.get("https://finglide.onrender.com/account/getAccounts/",{withCredentials:true}),
          axios.get("https://finglide.onrender.com/category/getCategories/",{withCredentials:true}),
          axios.get("https://finglide.onrender.com/transaction/getTransactions/",{withCredentials:true}),
          axios.get("https://finglide.onrender.com/budget/getBudgets/",{withCredentials:true})
      ])
      dispatch(actions.setAccountList(accountResponse.data.accounts))
      dispatch(actions.setCategoryList(categoryResponse.data.Categories))
      dispatch(actions.setTransactionList(transactionResponse.data.transactions))
      dispatch(actions.setBudgetList(budgetResponse.data.Budgets))
    } catch(err){
      console.log(`Error during fetching Details,Error: ${err}`)
    }
  }
  useEffect(() => { fetchAllDetails() },[dispatch,isUserLoggedIn])

  const fetchAllReportsDetails = async() => {
    try{
      const [pieDataResponse,lineDataResponse,expVsIncResponse] = await Promise.all([
        axios.get("https://finglide.onrender.com/category/getPieData/",{withCredentials:true}),
        axios.get("https://finglide.onrender.com/transaction/yearlySummary/",{withCredentials:true}),
        axios.get("https://finglide.onrender.com/transaction/expVsincYearly/",{withCredentials:true}),
      ])
      dispatch(actions.setPieData(pieDataResponse.data.transactionData))
      dispatch(actions.setLineData(lineDataResponse.data.summary))
      dispatch(actions.setexpVsInc(expVsIncResponse.data.summary))
    }catch(err){
      console.log(`Error during fetching Reports Details, Error: ${err}`)
    }
  }

  useEffect(() => {fetchAllReportsDetails()},[dispatch,isUserLoggedIn])
  

  return (
    <div>
      <Routes>
        <Route path='/' element={<ProtectedRoute><SideBar/></ProtectedRoute>}>
          <Route index element={<DashBoard/>}></Route>
          <Route path='/categories/' element={<Categories/>}></Route>
          <Route path='/accounts' element={<Accounts/>}></Route>
          <Route path='/transactions' element ={<Transactions/>}></Route>
          <Route path='/budgets' element ={<Budgets/>}></Route>
          <Route path='/reports' element ={<Reports/>}></Route>
        </Route>
        <Route path='/register/' element={<Signup />}></Route>
        <Route path='/login/' element={<Signin />}></Route>
      </Routes>
    </div>
  )
}

export default App

import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import slice from "../redux/slices";

const actions = slice.actions
export const FetchAppData = () => {
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
  useEffect(() => { fetchAllDetails() },[isUserLoggedIn])

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

  useEffect(() => { fetchAllReportsDetails() },[isUserLoggedIn])


}
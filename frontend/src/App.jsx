import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'
import DashBoard from './components/DashBoard'
import Layout from './components/Layout'
import Categories from './components/Categories'
import Accounts from './components/Accounts'
import Transactions from './components/Transactions'
import Budgets from './components/Budgets'
import Reports from './components/Reports'
import {ProtectedRoute, PublicRoute} from './components/ProtectedRoute'
import { FetchAppData } from './components/FetchAppData'

function App() {
  FetchAppData()

  return (
    <div>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<DashBoard/>}></Route>
          <Route path='/categories/' element={<Categories/>}></Route>
          <Route path='/accounts' element={<Accounts/>}></Route>
          <Route path='/transactions' element ={<Transactions/>}></Route>
          <Route path='/budgets' element ={<Budgets/>}></Route>
          <Route path='/reports' element ={<Reports/>}></Route>
        </Route>
        <Route path='/register/' element={<PublicRoute><Signup /></PublicRoute>}></Route>
        <Route path='/login/' element={<PublicRoute><Signin /></PublicRoute>}></Route>
      </Routes>
    </div>
  )
}

export default App

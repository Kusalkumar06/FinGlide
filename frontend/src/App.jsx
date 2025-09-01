import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'
import DashBoard from './components/DashBoard'
import SideBar from './components/SideBar'
import Categories from './components/Categories'
import Accounts from './components/Accounts'



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SideBar/>}>
          <Route index element={<DashBoard/>}></Route>
          {/* <Route path='/dashboard' element={<DashBoard/>}></Route> */}
          <Route path='/categories/' element={<Categories/>}></Route>
          <Route path='accounts' element={<Accounts/>}></Route>
        </Route>
        <Route path='/register/' element={<Signup />}></Route>
        <Route path='/login/' element={<Signin />}></Route>
      </Routes>
    </div>
  )
}

export default App

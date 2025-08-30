import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/register/' element={<Signup />}></Route>
        <Route path='/login/' element={<Signin />}></Route>
      </Routes>
    </div>
  )
}

export default App

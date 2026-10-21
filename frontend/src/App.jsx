import { Routes,Route } from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'
import DashBoard from './pages/DashBoard'
import Layout from './components/Layout'
import Categories from './pages/Categories'
import Accounts from './pages/Accounts'
import Transactions from './pages/TransactionPage.jsx'
import Budgets from './pages/Budgets'
import Reports from './pages/ReportsPage.jsx'
import About from './pages/About'
import Contact from './pages/Contact'
import {ProtectedRoute, PublicRoute} from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useSelector,useDispatch } from 'react-redux';
import Loader from './components/Loader'
import { useEffect } from 'react'
import { restoreSession } from './redux/coreThunks.js'

function App() {
  const  isLoading  = useSelector((state) => state.core.isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);


  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-60 bg-white flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/register" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Signin /></PublicRoute>} />
        </Routes>
      </div>
      <ToastContainer position='top-right'
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
/>
    </>
    
  )
}

export default App

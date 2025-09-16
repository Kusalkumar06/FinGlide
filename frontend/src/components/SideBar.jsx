import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { IoHomeOutline,IoWalletOutline,IoSettingsOutline } from "react-icons/io5";
import { LuTags,LuChartPie } from "react-icons/lu";
import { LiaCreditCardSolid } from "react-icons/lia";
import { TbReportSearch } from "react-icons/tb";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function SideBar() {
  const navigate = useNavigate()
  const handleLogout = async() => {
    const url = "https://finglide.onrender.com/auth/logout"
    await axios.post(url,{},{withCredentials:true})
    navigate('/login',{replace:true})
  }

  return (
    <div className='flex'>
      <div className='border-r-1 w-75 h-screen bg-gradient-to-b from-orange-100 via-white to-orange-100 flex flex-col fixed top-0 left-0 z-50'>
        {/* {Logo container} */}
        <div className='flex p-5 px-3 xl:px-9'>
          <div className='rounded-[50%] p-1 bg-[#da6e39] mr-1'>
            <img className='w-[55px]' src='https://res.cloudinary.com/dtrouncfb/image/upload/v1756573796/LogoMakr-0It9qV_n5txbu.png'/>
          </div>
          <div className='flex flex-col justify-around'>
            <img className='w-[110px]' src='https://res.cloudinary.com/dtrouncfb/image/upload/v1756719245/LogoMakr-44Pg4a_qp9nad.png'/>
            <p className='text-[10px] text-[#7D5555]'>Effortless finance, at your fingertips</p>
          </div>
        </div>

        <hr/>

        <div className='p-5'>
          <p className='text-[#958590] text-[16px]'>Navigation</p>
          <nav className='my-3'>
            <NavLink to='/' className={({isActive}) => `flex items-center justify-start px-2 py-1 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded ${isActive ? 'bg-[#F96C4A] text-white' : ''}`}>
              <IoHomeOutline size={20} className='text-[ #505050]' />
              <p className='ml-3 text-[18px] '>Dashboard</p>
            </NavLink>
            <NavLink to='/accounts' className={({isActive}) => `flex items-center justify-start px-2 py-1 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded ${isActive ? 'bg-[#F96C4A] text-white' : ''}`}>
              <IoWalletOutline size={20} className='text-[ #505050]' />
              <p className='ml-3 text-[18px] '>Accounts</p>
            </NavLink>
            <NavLink to='/categories' className={({isActive}) => `flex items-center justify-start px-2 py-1 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded ${isActive ? 'bg-[#F96C4A] text-white' : ''}`}>
              <LuTags size={20} className='text-[ #505050]' />
              <p className='ml-3 text-[18px] '>Categories</p>
            </NavLink>
            <NavLink to='/transactions' className={({isActive}) => `flex items-center justify-start px-2 py-1 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded ${isActive ? 'bg-[#F96C4A] text-white' : ''}`}>
              <LiaCreditCardSolid size={20} className='text-[ #505050]' />
              <p className='ml-3 text-[18px] '>Transactions</p>
            </NavLink>
            <NavLink to='/budgets' className={({isActive}) => `flex items-center justify-start px-2 py-1 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded ${isActive ? 'bg-[#F96C4A] text-white' : ''}`}>
              <LuChartPie size={20} className='text-[ #505050]' />
              <p className='ml-3 text-[18px] '>Budgets</p>
            </NavLink>
            <NavLink to='/reports' className={({isActive}) => `flex items-center justify-start px-2 py-1 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded ${isActive ? 'bg-[#F96C4A] text-white' : ''}`}>
              <TbReportSearch size={20} className='text-[ #505050]' />
              <p className='ml-3 text-[18px] '>Reports</p>
            </NavLink>
          </nav>
        </div>

        <div className='px-2 py-1 mt-auto gap-1 space-y-2'>
          <NavLink to='/' className='self-end flex items-center justify-start p-2 hover:bg-[#F96C4A] text-[#505050] hover:text-white rounded'>
            <IoSettingsOutline size={20} className='text-[ #505050]' />
            <p className='ml-3 text-[18px] '>Settings</p>
          </NavLink>
          <button onClick={handleLogout} className='w-[100%] bg-[#F96C4A] text-white p-1 text-[18px] rounded cursor-pointer'>Logout</button>
        </div>
      </div>



      <div className='flex-1 p-6 ml-75'>
        <Outlet/>
      </div>
    </div>
  )
}

export default SideBar

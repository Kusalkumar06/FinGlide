import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import slice from '../redux/slices'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const actions = slice.actions 

function Signin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const gradientStyle = {
    background: 'radial-gradient(circle, #FFFBF3, #da6e39)',
  };

  const {loginUsername,loginPassword,loginErr} = useSelector((store) => {
    return store.sliceState;
  })

  const handleUsername = (event) => {
    dispatch(actions.loginusername(event.target.value))
  }

  const handlePassword = (event) => {
    dispatch(actions.loginpassword(event.target.value))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const details = {
      username:loginUsername,
      password:loginPassword,
    }
    try{
      // const url = "http://localhost:5000/auth/login"
      const url = "https://finglide.onrender.com/auth/login";
      await axios.post(url,details,{withCredentials:true})
      dispatch(actions.setIsUserLoggedIn())
      navigate('/',{replace:true})
      
    }catch(err){
      dispatch(actions.setLoginErr())
      console.error(`Error during the login: ${err}`)
    }
  }


  return (
    <div style={gradientStyle} className='h-screen flex items-center justify-center'>
      <div className='bg-[#FFFBF3] p-[40px] rounded-lg shadow-lg w-[460px]'>
        <div className='text-center mb-10 flex flex-col items-center justify-between h-[150px]'>
          <div className='rounded-[50%] p-2 bg-[#da6e39]'>
            <img className='w-[60px]' src='https://res.cloudinary.com/dtrouncfb/image/upload/v1756573796/LogoMakr-0It9qV_n5txbu.png'/>
          </div>
          <div>
            <h1 className='text-[#3F3831] text-[25px] font-[600]'>Welcome to FinGlide</h1>
            <p className='text-gray-600'>Sign in to your account to manage your expenses</p>
          </div>
        </div>
        <form className='my-5' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-6'>
            <label className='mb-2 text-[#473624] font-[600] text-[18px]'>Username</label>
            <input className='border-1 rounded p-1 outline-none ' required placeholder='Enter username' type='text' value={loginUsername} onChange={handleUsername}/>
          </div>
          <div className='flex flex-col mb-7'>
            <label className='mb-2 text-[#473624] font-[600] text-[18px]'>Password</label>
            <input className='border-1 rounded p-1 outline-none' required placeholder='Enter password' type='password' value={loginPassword} onChange={handlePassword}/>
          </div>
          <div className='flex flex-col justify-center'>
            <button className='p-1 rounded bg-[#D86D38] text-[#FFFBF3] font-[600] cursor-pointer'>Sign in</button>
          </div>
          {loginErr && <p className='text-red-400 my-2'>*Invalid Credentials</p>}
        </form>
        <div>
          <p className='text-[#414141] text-[17px]'>Don't have an account? <Link to="/register/" className='text-blue-500'>Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signin
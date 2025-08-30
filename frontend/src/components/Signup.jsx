import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import slice from '../redux/slices'
import { Link } from 'react-router-dom'

const actions = slice.actions

function Signup() {
  const dispatch = useDispatch()

  const gradientStyle = {
    background: 'radial-gradient(circle, #FFFBF3, #da6e39)',
  };

  const {registerName,registerPassword,registerEmail,registerErr} = useSelector((store) => {
    return store.sliceState;
  })

  const handleUsername = (event) => {
    dispatch(actions.registername(event.target.value))
  }

  const handleEmail = (event) => {
    dispatch(actions.registeremail(event.target.value))
  }

  const handlePassword = (event) => {
    dispatch(actions.registerpassword(event.target.value))
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    const details = {
        username : registerName,
        password : registerPassword,
        email :registerEmail,
    }
    const url = "http://localhost:5000/auth/register";
    const options = {
        method : "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(details),
    }
    const response = await fetch(url,options);
    const data = await response.json()
    console.log(data)
    console.log(response)
  }


  return (
    <div style={gradientStyle} className='h-screen flex items-center justify-center'>
      <div className='bg-[#FFFBF3] p-[40px] rounded-lg shadow-lg w-[480px]'>
        <div className='text-center mb-10 flex flex-col items-center justify-between h-[150px]'>
          <div className='rounded-[50%] p-2 bg-[#da6e39]'>
            <img className='w-[60px]' src='https://res.cloudinary.com/dtrouncfb/image/upload/v1756573796/LogoMakr-0It9qV_n5txbu.png'/>
          </div>
          <div>
            <h1 className='text-[#3F3831] text-[25px] font-[600]'>Create Your Account</h1>
            <p className='text-gray-600'>Join FinGlide to start tracking your finances</p>
          </div>
        </div>
        <form className='my-3' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 text-[#473624] font-[600] text-[18px]'>Full Name</label>
            <input className='border-1 rounded p-2 outline-none' required placeholder='Enter your fullname' type='text' value={registerName} onChange={handleUsername}/>
          </div>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 text-[#473624] font-[600] text-[18px]'>Email</label>
            <input className='border-1 rounded p-2 outline-none' required placeholder='Enter your email' type='email' value={registerEmail} onChange={handleEmail}/>
          </div>
          <div className='flex flex-col mb-7'>
            <label className='mb-2 text-[#473624] font-[600] text-[18px]'>Password</label>
            <input className='border-1 rounded p-2 outline-none' required placeholder='Create a password' type='password' value={registerPassword} onChange={handlePassword}/>
          </div>
          <div className='flex flex-col justify-center'>
            <button className='p-1 rounded bg-[#D86D38] text-[#FFFBF3] font-[600]'>Sign Up</button>
          </div>
          {registerErr && <p className='text-red-400 my-2'>*User Already exists. Please try another Name</p>}
        </form>
        <div>
          <p className='text-[#414141] text-[17px]'>Already have an account? <Link to="/login/" className='text-blue-500'>Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup
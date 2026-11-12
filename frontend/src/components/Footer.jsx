import React from 'react'
import { Link } from 'react-router-dom'
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { BACKGROUND_COLORS, TEXT_COLORS, TYPOGRAPHY } from '../design-system'

function Footer() {
  return (
    <footer className='min-w-full bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700'>
      <div className='mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1'>
            <div className='flex items-center mb-4'>
              <div className={`rounded-full p-1 ${BACKGROUND_COLORS.bgBrandDeep} mr-2`}>
                <img className='w-12' src='https://res.cloudinary.com/dtrouncfb/image/upload/v1756573796/LogoMakr-0It9qV_n5txbu.png' alt='FinGlide Logo'/>
              </div>
              <h2 className='text-2xl font-bold text-white'>FinGlide</h2>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Effortless finance management at your fingertips. Track expenses, manage budgets, and achieve financial goals.
            </p>
          </div>

          <div>
            <h3 className={`text-lg font-semibold text-white mb-4`}>Quick Links</h3>
            <ul className='space-y-2'>
              <li><Link to='/' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>Dashboard</Link></li>
              <li><Link to='/accounts' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>Accounts</Link></li>
              <li><Link to='/categories' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>Categories</Link></li>
              <li><Link to='/transactions' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>Transactions</Link></li>
              <li><Link to='/budgets' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>Budgets</Link></li>
              <li><Link to='/reports' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>Reports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-white mb-4'>About Us</h3>
            <p className='text-gray-300 text-sm leading-relaxed mb-3'>
              FinGlide is your trusted companion for financial management, helping you make informed decisions and achieve financial freedom.
            </p>
            <div className='flex space-x-3'>
              <a href='#' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>
                <FaTwitter size={20} />
              </a>
              <a href='#' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>
                <FaLinkedin size={20} />
              </a>
              <a href='#' className={`text-gray-300 hover:${TEXT_COLORS.primaryAccent} transition-colors`}>
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-white mb-4'>Contact Info</h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center text-gray-300'>
                <MdEmail size={18} className='mr-2 text-orange-400' />
                <span>support@finglide.com</span>
              </div>
              <div className='flex items-center text-gray-300'>
                <MdPhone size={18} className='mr-2 text-orange-400' />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className='flex items-center text-gray-300'>
                <MdLocationOn size={18} className='mr-2 text-orange-400' />
                <span>123 Finance St, Suite 100<br/>San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-700 text-center'>
          <p className='text-gray-400 text-sm'>
            &copy; {new Date().getFullYear()} FinGlide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

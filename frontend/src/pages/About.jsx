import React from 'react'
import { FaChartLine, FaShieldAlt, FaWallet, FaChartPie } from 'react-icons/fa'
import { MdAccountBalance, MdCategory, MdTrendingUp } from 'react-icons/md'

function About() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#3A3A3A] text-3xl sm:text-4xl font-bold mb-4">About FinGlide</h1>
        <p className="text-[#3B3F40] text-lg leading-relaxed">
          FinGlide is a modern personal finance management application designed to help users take control of their financial lives. 
          Track your income, expenses, budgets, and overall financial health with ease and confidence. Our intuitive platform 
          empowers you to make informed financial decisions and achieve your financial goals.
        </p>
      </div>

      <div className="mb-10 bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6 sm:p-8">
        <h2 className="text-[#3A3A3A] text-2xl sm:text-3xl font-semibold mb-4">Why FinGlide?</h2>
        <p className="text-[#3B3F40] text-base sm:text-lg leading-relaxed mb-4">
          Managing personal finances can be overwhelming. Many people struggle with tracking multiple bank accounts, 
          categorizing expenses, staying within budgets, and understanding where their money goes each month.
        </p>
        <p className="text-[#3B3F40] text-base sm:text-lg leading-relaxed">
          FinGlide simplifies and centralizes everything. With our platform, you get a complete overview of your financial 
          life in one place. No more spreadsheets, no more guessing. Just clear insights and actionable data to help you 
          save more, spend wisely, and reach your financial goals faster.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-[#3A3A3A] text-2xl sm:text-3xl font-semibold mb-6">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <FaWallet color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Expense & Income Tracking</h3>
                <p className="text-[#3B3F40] text-base leading-relaxed">
                  Record every transaction with detailed categorization. Track income sources and expense patterns 
                  to understand your cash flow. Add notes, attach receipts, and never lose track of where your money goes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <MdTrendingUp color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Smart Budget Management</h3>
                <p className="text-[#3B3F40] text-base leading-relaxed">
                  Set monthly budgets for different spending categories. Get real-time alerts when you approach your limits. 
                  Visualize your spending versus budget with intuitive progress bars and charts.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <FaChartLine color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Reports & Visual Analytics</h3>
                <p className="text-[#3B3F40] text-base leading-relaxed">
                  Gain insights through powerful charts and reports. Analyze spending trends over time, compare income 
                  vs. expenses month-by-month, and identify opportunities to save. Make data-driven financial decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <FaShieldAlt color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Secure & Private User Data</h3>
                <p className="text-[#3B3F40] text-base leading-relaxed">
                  Your financial data is encrypted and secured. We use industry-standard security protocols to protect 
                  your information. Your privacy is our priority, and your data remains yours alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6 sm:p-8">
        <h2 className="text-[#3A3A3A] text-2xl sm:text-3xl font-semibold mb-6">How FinGlide Works</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#D96D38] text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">
              1
            </div>
            <div>
              <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Add Accounts and Categories</h3>
              <p className="text-[#3B3F40] text-base leading-relaxed">
                Start by setting up your financial accounts (bank accounts, wallets, credit cards) and create custom 
                categories for your income and expenses (groceries, rent, salary, freelance, etc.).
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#D96D38] text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">
              2
            </div>
            <div>
              <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Record Income, Expenses, and Transfers</h3>
              <p className="text-[#3B3F40] text-base leading-relaxed">
                Log every transaction with a few clicks. Add income when you get paid, record expenses when you spend, 
                and track transfers between accounts. Add details like notes and dates for complete records.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#D96D38] text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">
              3
            </div>
            <div>
              <h3 className="text-[#3A3A3A] text-xl font-semibold mb-2">Analyze Reports and Improve Savings</h3>
              <p className="text-[#3B3F40] text-base leading-relaxed">
                Review your dashboard and reports regularly. Identify spending patterns, monitor budget adherence, 
                and discover areas where you can cut back. Use insights to optimize your finances and grow your savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <MdAccountBalance size={32} color="#D96D38" className="mr-3" />
              <h2 className="text-[#3A3A3A] text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-[#3B3F40] text-base leading-relaxed">
              Our mission is to make personal finance management simple, accessible, and empowering for everyone. 
              We believe that financial literacy and smart money management should not be complicated. FinGlide 
              provides the tools you need to understand and control your finances without unnecessary complexity.
            </p>
          </div>

          <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <FaChartPie size={32} color="#D96D38" className="mr-3" />
              <h2 className="text-[#3A3A3A] text-2xl font-semibold">Our Vision</h2>
            </div>
            <p className="text-[#3B3F40] text-base leading-relaxed">
              We envision a world where everyone has the confidence and knowledge to make data-driven financial decisions. 
              FinGlide aims to be the trusted companion that helps users achieve financial independence, reduce stress 
              about money, and build a secure financial future for themselves and their families.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

import {  BarChart,  Bar,  XAxis,  YAxis,  Tooltip,  Legend,  ResponsiveContainer,  CartesianGrid} from "recharts";
import { PieChart, Pie, Cell, } from "recharts"; 
import {AreaChart,Area} from "recharts";
import {LineChart,Line} from "recharts";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import slice from "../redux/slices";

const actions = slice.actions

export function BarChartSpVsBud(){

  const dispatch = useDispatch();


  const {speVsbudYear,speVsbudMonth,spendVsBudgetData} = useSelector((store) => {
    return store.sliceState;
  })

  console.log(speVsbudMonth,speVsbudYear)

  const fetchSpendVsBudget = () => {
      const fn = async () => {
        const url = `http://localhost:5000/budget/spendVsBudget?month=${speVsbudMonth}&year=${speVsbudYear}`
        const response = await axios.get(url,{withCredentials:true})
        // console.log(response.data.accounts)
        dispatch(actions.setspendVsBudget(response.data.data))
      }
      fn()
    }
    useEffect(fetchSpendVsBudget,[])

    console.log(spendVsBudgetData)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-md text-sm">
          <p className="font-semibold">{label}</p>
          <p>${payload[0].value} Budget</p>
          <p>${payload[1].value} Spent</p>
        </div>
      );
    }
    return null;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


  return (
    <div className="flex items-center items-stretch gap-4">
      <div className="shadow-lg bg-[#FFFAF4] w-[60%] rounded-2xl p-4 border-1 border-[#DDDFDE]">
        <div className="self-start mb-5 flex justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Category Spending vs Budget</h2>
              <p className="text-[#8E5660]">Compare actual spending against budgets.</p>
            </div>
            <div>
              <div className="flex gap-4 items-center">
                <select className="px-2 p-1 border rounded" value={speVsbudMonth} onChange={(e) => dispatch(actions.setspeVsBudMonth(parseInt(e.target.value)))}>
                  {months.map((month, i) => (
                    <option key={i} value={i + 1}>{month}</option>
                  ))}
                </select>

                <select className="px-2 p-1 border rounded" value={speVsbudYear} onChange={(e) => dispatch(actions.setspeVsBudYear(parseInt(e.target.value)))}>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
                    .map((year,i) => (
                      <option key={i} value={year}>{year}</option>
                    ))}
                </select>
              </div>
            </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={spendVsBudgetData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoryName" fontSize={10}/>
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="budget" fill="#888888" name="Budget" />
            <Bar dataKey="spent" fill="#ff6600" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <div className="shadow-lg flex-1 bg-[#FFFAF4] rounded-2xl p-4 border-1 border-[#DDDFDE]">
        <div className="self-start mb-5">
            <h2 className="text-lg font-semibold text-gray-700">Category Analysis</h2>
            <p className="text-[#8E5660]">Detailed breakdown of spending by category.</p>
        </div>
        <div className='my-3 space-y-1'>
          <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
            <div>
              <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
              <p className='text-[12px] text-gray-700'>65 Transactions</p>
            </div>
            <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
          </div>
          <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
            <div>
              <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
              <p className='text-[12px] text-gray-700'>29 Transactions</p>
            </div>
            <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
          </div>
          <div className='flex items-center justify-between bg-[#FFFAF4] border-2 border-[#DDDFDE] p-1 rounded-lg'>
            <div>
              <h1 className='text-[#433C3E] text-[20px]'>Grocery Store</h1>
              <p className='text-[12px] text-gray-700'>48 Transactions</p>
            </div>
            <h1 className='text-green-700 text-[18px]'>₹15,750.5</h1>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export  function PieChartCategory() {
  const dispatch = useDispatch()

  const {pieData} = useSelector((store) => {
    return store.sliceState
  })

  const fetchLineData = () => {
      const fn = async () => {
        const url = "http://localhost:5000/category/getPieData/"
        const response = await axios.get(url,{withCredentials:true})
        // console.log(response.data.accounts)
        dispatch(actions.setPieData(response.data.transactionData))
      }
      fn()
    }
    useEffect(fetchLineData,[])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name,total } = payload[0].payload; 
      const totalAmount = pieData.reduce((sum, entry) => sum + entry.total, 0);
      const percentage = ((total / totalAmount) * 100).toFixed(1);

      return (
        <div className="bg-white p-2 shadow-lg rounded-md border text-sm">
          <p className="font-semibold text-black" >{name}</p>
          <p className="text-black">Amount: ₹{total}</p>
          <p className="text-black">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="">
      <div className="flex flex-col bg-[#FFFAF4] border-1 border-[#DDDFDE] shadow-lg rounded-2xl justify-center items-center rounded-2xl p-4 w-full max-w-md mr-3">
        <div className="self-start">
          <h2 className="text-lg font-semibold text-gray-700">Expenses by Category</h2>
          <p className="text-[#8E5660]">Your spending breakdown for this month.</p>
        </div>
        <PieChart width={350} height={350} stroke="none">
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={1}
            dataKey="total"
            labelLine={false}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
            animationBegin={0}

          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color}/>
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} animationDuration={0} />
          <Legend verticalAlign="bottom" height={50} />
        </PieChart> 
      </div>
    </div>
  );
}

const areadata = [
  { month: "Jan", checking: 15000, savings: 5000, investment: 5000 },
  { month: "Feb", checking: 13200, savings: 7800, investment: 6000 },
  { month: "Mar", checking: 12500, savings: 6000, investment: 7000 },
  { month: "Apr", checking: 13800, savings: 6500, investment: 8000 },
  { month: "May", checking: 14500, savings: 6800, investment: 9000 },
  { month: "Jun", checking: 15500, savings: 7000, investment: 10000 },
  { month: "Jul", checking: 16000, savings: 7500, investment: 12000 },
  { month: "Aug", checking: 16800, savings: 7700, investment: 13000 },
  { month: "Sep", checking: 17200, savings: 7900, investment: 14000 },
  { month: "Oct", checking: 17500, savings: 8000, investment: 15000 },
  { month: "Nov", checking: 17800, savings: 8100, investment: 15000 },
  { month: "Dec", checking: 18000, savings: 8200, investment: 10000 },
];

export function AreaGraphAccount  () {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-md border text-sm">
          {payload.map((entry) => (
            <p key={entry.name} className="text-black font-semibold">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-[#FFFAF4] shadow-lg rounded-2xl justify-center items-center rounded-2xl p-4 w-full mr-3">
      <h2 className="text-lg font-semibold text-gray-700 self-start">Account Balance Trends</h2>
      <p className="text-gray-500 text-sm mb-4 self-start">How your account balances have changed over time</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={areadata} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorChecking" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8"  />
              <stop offset="95%" stopColor="#8884d8" />
            </linearGradient>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d"  />
              <stop offset="95%" stopColor="#82ca9d" />
            </linearGradient>
            <linearGradient id="colorinvestment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" />
              <stop offset="95%" stopColor="#ffc658"/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="checking" stackId="1" stroke="#8884d8" fill="url(#colorChecking)" />
          <Area type="monotone" dataKey="savings" stackId="1" stroke="#82ca9d" fill="url(#colorSavings)" />
          <Area type="monotone" dataKey="investment" stackId="1" stroke="#ffc658" fill="url(#colorinvestment)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


export  function LineChartInVsEx() {
  const dispatch = useDispatch()

  const {linedata} = useSelector((store) => {
    return store.sliceState
  })

  const fetchLineData = () => {
      const fn = async () => {
        const url = "http://localhost:5000/transaction/yearlySummary/"
        const response = await axios.get(url,{withCredentials:true})
        console.log(response.data.summary)
        dispatch(actions.setLineData(response.data.summary))
      }
      fn()
    }
    useEffect(fetchLineData,[])
    // console.log(linedata)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-md border text-sm">
          {payload.map((entry) => (
            <p key={entry.name} className="text-black font-semibold">
              {entry.name}: ₹{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="flex items-center justify-center mt-5">
      <div className="bg-[#FFFAF4] shadow-lg rounded-2xl p-4 w-full max-w-4xl border-1 border-[#DDDFDE]">
        <div className="self-start mb-5">
          <h2 className="text-lg font-semibold text-gray-700">Monthly Income, Expenses & Savings</h2>
          <p className="text-[#8E5660]">Income, expenses, and savings over the past year.</p>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={linedata} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="income" stroke="#0088FE" strokeWidth={2} dot={{ r: 4 }}/>
              <Line type="monotone" dataKey="expense" stroke="#FF8042" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="savings" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const data = [
  { month: "Jan", income: 5000, expenses: 4000 },
  { month: "Feb", income: 4500, expenses: 3800 },
  { month: "Mar", income: 5200, expenses: 4300 },
  { month: "Apr", income: 4800, expenses: 3900 },
  { month: "May", income: 6000, expenses: 4700 },
  { month: "Jun", income: 5500, expenses: 4500 },
  { month: "Jul", income: 5000, expenses: 4200 },
  { month: "Aug", income: 5300, expenses: 4600 },
  { month: "Sep", income: 5800, expenses: 4900 },
  { month: "Oct", income: 6000, expenses: 5000 },
  { month: "Nov", income: 6200, expenses: 5100 },
  { month: "Dec", income: 6500, expenses: 5200 },
];


export function BarChartInVsEx() {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-md border text-sm">
          {payload.map((entry) => (
            <p key={entry.name} className="text-black font-semibold">
              {entry.name}: ₹{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="bg-[#FFFAF4] border-1 border-[#DDDFDE] rounded-2xl p-4 w-[730px] max-w-4xl flex-1">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Monthly Income vs Expenses</h2>
        <p className="text-[#8E5660]">Monthly comparison over the past year</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend height={36} />
          <Bar dataKey="income" fill="#0088FE" barSize={15} />
          <Bar dataKey="expenses" fill="#FF8042" barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

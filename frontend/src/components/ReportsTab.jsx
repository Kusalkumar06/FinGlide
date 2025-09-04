import {  BarChart,  Bar,  XAxis,  YAxis,  Tooltip,  Legend,  ResponsiveContainer,  CartesianGrid} from "recharts";
import { PieChart, Pie, Cell, } from "recharts"; 
import {AreaChart,Area} from "recharts";
import {LineChart,Line} from "recharts";

const bardata = [
  { category: "Food", budget: 8000, spent: 7800 },
  { category: "Transport", budget: 4500, spent: 4200 },
  { category: "Shopping", budget: 3500, spent: 3800 },
  { category: "Bills", budget: 4000, spent: 3600 },
  { category: "Entertainment", budget: 2000, spent: 2500 },
  { category: "Healthcare", budget: 1500, spent: 1000 },
  { category: "Travel", budget: 2500, spent: 2000 },
];

export function BarChartSpVsBud(){

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


  return (
    <div className="flex flex-col bg-[#FFFAF4] shadow-lg rounded-2xl justify-center items-center rounded-2xl p-4 w-full mr-3">
      <ResponsiveContainer width="70%" height={350}>
        <BarChart data={bardata} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" fill="#888888" name="Budget" />
          <Bar dataKey="spent" fill="#ff6600" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const piedata = [
  { name: "Food", value: 400 },
  { name: "Shopping", value: 300 },
  { name: "Transport", value: 300 },
  { name: "Entertainment", value: 200 },
  { name: "Bills", value: 278 },
];

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AF19FF"];

export  function PieChartCategory() {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload; 
      const total = piedata.reduce((sum, entry) => sum + entry.value, 0);
      const percentage = ((value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-2 shadow-lg rounded-md border text-sm">
          <p className="font-semibold text-black" >{name}</p>
          <p className="text-black">Amount: ₹{value}</p>
          <p className="text-black">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="">
      <div className="flex flex-col bg-[#FFFAF4] shadow-lg rounded-2xl justify-center items-center rounded-2xl p-4 w-full max-w-md mr-3">
        <div className="self-start">
          <h2 className="text-lg font-semibold text-gray-700">Expenses by Category</h2>
          <p className="text-[#8E5660]">Your spending breakdown for this month.</p>
        </div>
        <PieChart width={350} height={350} stroke="none">
          <Pie
            data={piedata}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={1}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
            animationBegin={0}

          >
            {piedata.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
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

// Example monthly data
const linedata = [
  { month: "Jan", income: 5000, expenses: 4000, savings: 1000 },
  { month: "Feb", income: 4500, expenses: 3800, savings: 700 },
  { month: "Mar", income: 5200, expenses: 4300, savings: 900 },
  { month: "Apr", income: 4800, expenses: 3900, savings: 900 },
  { month: "May", income: 6000, expenses: 4700, savings: 1300 },
  { month: "Jun", income: 5500, expenses: 4500, savings: 1000 },
  { month: "Jul", income: 5000, expenses: 4200, savings: 800 },
  { month: "Aug", income: 5300, expenses: 4600, savings: 700 },
  { month: "Sep", income: 5800, expenses: 4900, savings: 900 },
  { month: "Oct", income: 6000, expenses: 5000, savings: 1000 },
  { month: "Nov", income: 6200, expenses: 5100, savings: 1100 },
  { month: "Dec", income: 6500, expenses: 5200, savings: 1300 },
];

// Custom Tooltip
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

export  function LineChartInVsEx() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-4xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Income, Expenses & Savings</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={linedata} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="income" stroke="#0088FE" strokeWidth={2} dot={{ r: 4 }}/>
          <Line type="monotone" dataKey="expenses" stroke="#FF8042" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="savings" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

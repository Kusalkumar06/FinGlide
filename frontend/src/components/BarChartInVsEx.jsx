import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Example monthly data
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

export default function BarChartInVsEx() {
  return (
    <div className="bg-[#FFFAF4] rounded-2xl p-4 w-[730px] max-w-4xl flex-1">
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

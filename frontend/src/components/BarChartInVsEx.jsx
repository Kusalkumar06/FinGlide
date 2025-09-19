import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import EmptyView from "./EmptyView";

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

  const {expVsInc} = useSelector((store) => {
    return store.sliceState
  })
  
  return (
    <div className="bg-[#FFFAF4] rounded-2xl p-4 w-[730px] h-full max-w-4xl flex-1">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Monthly Income vs Expenses</h2>
        <p className="text-[#8E5660]">Monthly comparison over the past year</p>
      </div>
      {!expVsInc.every((each) => each.income === 0 && each.expense === 0) ? <ResponsiveContainer width="100%" height={350}>
        <BarChart data={expVsInc} margin={{ top: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend height={36} />
          <Bar dataKey="income" fill="#0088FE" barSize={15} />
          <Bar dataKey="expense" fill="#FF8042" barSize={15} />
        </BarChart>
      </ResponsiveContainer> : <EmptyView message={"No income or expense records available in this year."}/>}
    </div>
  );
}

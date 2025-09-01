import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Food", value: 400 },
  { name: "Shopping", value: 300 },
  { name: "Transport", value: 300 },
  { name: "Entertainment", value: 200 },
  { name: "Bills", value: 278 },
];

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AF19FF"];

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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload; 
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
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

export default function PieChartCategory() {
  return (
    <div className="bg-[#FFFAF4] flex flex-col justify-center items-center shadow-lg rounded-2xl p-4 w-full max-w-md mr-3 shadow-lg border-1 border-[#DDDFDE] h-[]">
      <div className="self-start">
        <h2 className="text-lg font-semibold text-gray-700">Expenses by Category</h2>
        <p className="text-[#8E5660]">Your spending breakdown for this month.</p>
      </div>
      <PieChart width={350} height={350} stroke="none">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={1}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} animationDuration={0} />
        <Legend verticalAlign="bottom" height={50} />
      </PieChart> 
    </div>
  );
}

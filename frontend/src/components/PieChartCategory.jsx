import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useSelector } from "react-redux";
import { scaleSequential } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";
import EmptyView from "./EmptyView";

export default function PieChartCategory() {

  const {pieData} = useSelector((store) => {
      return store.sliceState
  })
   const rainbowColor = scaleSequential(interpolateRainbow).domain([0, pieData.length]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, total } = payload[0].payload; 
      const totalValue = pieData.reduce((sum, entry) => sum + entry.total, 0);
      const percentage = ((total / totalValue) * 100).toFixed(1);

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
    <div className="flex flex-col justify-center items-center rounded-2xl p-4 w-full h-full max-w-md mr-3">
      <div className="self-start">
        <h2 className="text-lg font-semibold text-gray-700">Expenses by Category</h2>
        <p className="text-[#8E5660]">Your spending breakdown for this month.</p>
      </div>
      { pieData.length > 0 ? <PieChart width={350} height={350} stroke="none">
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
            <Cell key={`cell-${index}`} fill={rainbowColor(index)}/>
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} animationDuration={0} />
        <Legend verticalAlign="bottom" height={50} />
      </PieChart> 
      :  <EmptyView message={"No expenses to display yet."}/>
      }
    </div>
  );
}

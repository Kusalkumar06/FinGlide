import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { scaleSequential } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";
import EmptyView from "./EmptyView";

export default function PieChartCategory() {
  const { pieData } = useSelector(store => store.sliceState)
  const rainbowColor = scaleSequential(interpolateRainbow)
    .domain([0, pieData.length])

  return (
    <div className="flex flex-col bg-[#FFFAF4] rounded-2xl p-4 w-full h-full min-w-0">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Expenses by Category
        </h2>
        <p className="text-[#8E5660]">
          Your spending breakdown for this month.
        </p>
      </div>

      {pieData.length > 0 ? (
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="75%"
                paddingAngle={1}
                dataKey="total"
                isAnimationActive
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={rainbowColor(i)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyView message="No expenses to display yet." />
      )}
    </div>
  )
}

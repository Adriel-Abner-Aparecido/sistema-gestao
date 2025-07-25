import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart(props) {
  const data = props.data
  return (
    <div className="w-full h-full">
      <Pie data={data} />
    </div>
  )
}

/* eslint-disable react/prop-types */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const RacePositionTrendChart = ({ raceData }) => {
  return (
    <LineChart width={700} height={450} data={raceData} className="rounded-lg shadow-lg">
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="raceName" angle={-45} height={80} tick={{ fill: "#fff" }} />
      <YAxis domain={[1, 20]} reversed tick={{ fill: "#fff" }} />
      <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }} />
      <Line type="monotone" dataKey="position" stroke="#ff4444" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default RacePositionTrendChart;

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#876340", "#876330", "#876320", "#876310", "#876300"];

const PieChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("https://app.15may.club/api/admin/dashboard/complaints-analysis", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const rawData = res.data.data.complaintStats;

      // تحويل percent إلى أرقام
      const formattedData = rawData.map(item => ({
        name: item.name,
        percent: parseFloat(item.percent)
      }));

      setData(formattedData);
    })
    .catch((err) => {
      console.error("Error fetching pie data", err);
    });
}, []);


  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="percent"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;

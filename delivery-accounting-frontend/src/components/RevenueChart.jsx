import { useEffect, useState } from "react";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function RevenueChart() {
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const res = await API.get("/charts/revenue");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip />

        <Legend />

       <Line
  type="monotone"
  dataKey="accounting"
  name={t("AccountingDepartment")}
  stroke="#2563eb"
  strokeWidth={3}
/>

        <Line
          type="monotone"
          dataKey="tariff"
          name={t("tariff")}
          stroke="#16a34a"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueChart;
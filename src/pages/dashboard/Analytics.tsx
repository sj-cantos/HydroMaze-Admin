import { useContext, useEffect } from "react";
import SidebarContext from "@/SidebarContext";
import axios from "axios";
import { useState } from "react";
import InfoCard from "@/components/Analytics/InfoCard";
import Chart from "react-apexcharts";
import "../../styles/Analytics.css"

const Analytics = () => {
  const { setActiveItem } = useContext(SidebarContext);

  const [monthTotal, setMonthTotal] = useState<number>();
  const [weekTotal, setWeekTotal] = useState<number>();
  const [yearTotal, setYearTotal] = useState<number>();
  const [conTypeSales, setConTypeSales] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  
  const chartOptions = {
    options: {
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        type: "datetime",
        labels: {
          format: "dd MMM",
        },
      },

      colors: ["#0084ff", "#00b8d9", "#00c7b6", "#00e396", "#0acf97"],
      legend: {
        show: true,
      },
      chart: {
        type: "area",
        background: "white",
      },
    },

    series: [
      {
        name: "Revenue",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };
  
  
  useEffect(() => {
    setActiveItem("/analytics");
  }, []);

  useEffect(() => {
    const salesData = async() => {
      const totalSales = await axios.get("http://localhost:4001/api/v1/analytics/total-sales");
      const containerTypeSales = await axios.get("http://localhost:4001/api/v1/analytics/container-type-rev");
      const monthlySales = await axios.get("http://localhost:4001/api/v1/analytics/monthly-rev");

      if (totalSales.data.monthlySalesTotal.total) {
        setMonthTotal(totalSales.data.monthlySalesTotal.total);
      } else {
        setMonthTotal(0);
      }

      if (totalSales.data.weeklySalesTotal.total) {
        setWeekTotal(totalSales.data.weeklySalesTotal.total);
      } else {
        setWeekTotal(0);
      }

      if (totalSales.data.yearlySalesTotal.total) {
        setYearTotal(totalSales.data.yearlySalesTotal.total);
      } else {
        setYearTotal(0);
      }


      setConTypeSales(containerTypeSales.data);
      setMonthlySalesData(monthlySales.data);  
      
    }
    salesData();
  },[])

  return (
    <div className="relative left-[285px]">
      <h1 className="ml-5 mt-5 font-semibold text-gray-800 text-3xl">
        ANALYTICS
      </h1>
      <hr className="m-2" />

      <div className="container">
        <div className="card1"><InfoCard sales = {20} /></div>
        <div className="card2"><InfoCard  sales = {20} /></div>
        <div className="lineGraph">
          <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="line"
            width="100%"
            height="100%"
            className="dashboard-charts"
            style={{
              marginTop:"60px"
            }}
          />
        </div>
        <div className="card3"><InfoCard  sales = {20}/></div>
        <div className="card4"><InfoCard  sales = {20}/></div>
        <div className="barGraph">
          <Chart
                options={chartOptions}
                series={chartOptions.series}
                type="bar"
                width="100%"
                height="100%"
                className="dashboard-charts"
                style={{
                  marginTop:"60px"
                }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;

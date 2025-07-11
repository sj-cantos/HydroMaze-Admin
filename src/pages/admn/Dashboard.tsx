import { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DataCard } from "../../components/Dashboard/DataCard.tsx";
import { IoCartSharp } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import SidebarContext from "@/SidebarContext.ts";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import "../../styles/Dashboard.css";
import Lottie from "lottie-react";
import animationData from "../../assets/animation.json";
import { useAuth } from "@/AuthContext.tsx";
type StatusData = { _id: string; count: number };
type SalesData = {
  date: Date;
  revenue: number;
};

interface Orders {
  _id: string;
  username: string;
  round: number;
  slim: number;
  total: number;
  isOwned: boolean;
  status: string;
  createdAt: string;
  date: string;
  time: string;
}

export const Dashboard = () => {
  const { expanded, setActiveItem } = useContext(SidebarContext);
  const { adminCredentials, isLoggedIn, axiosJWT } = useAuth();
  const [expandedClass, setExpandedClass] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [todaysOrders, setTodaysOrders] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [dailySales, setDailySales] = useState<SalesData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Orders[]>([]);
  const [salesMonth, setSalesMonth] = useState(0);

  const pieOptions = {
    labels: statusData.map((data) => data._id),
    series: statusData.map((data) => data.count),
    colors: ["#0084ff", "#00b8d9", "#00c7b6", "#00e396", "#0acf97"],
    legend: {
      show: true,
    },
    chart: {
      toolbar: {
        show: true,
      },
    },
  };

  const chartOptions = {
    options: {
      xaxis: {
        categories: dailySales.map((data) => data.date),
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
        data: dailySales.map((data) => data.revenue),
      },
    ],
  };

  useEffect(() => {
    setActiveItem("/");

    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${adminCredentials.token}` },
        };

        const todaysOrders = await axiosJWT.get(
          "http://localhost:4001/api/v1/dashboard/orders-today/",
          config
        );
        console.log('db',todaysOrders)
        console.log('db',todaysOrders.data.count)
        setTodaysOrders(todaysOrders.data[0].count || 0);

        const todaysRevenue = await axiosJWT.get(
          "http://localhost:4001/api/v1/dashboard/revenue-today/",
          config
        );
        setTodaysRevenue(todaysRevenue.data[0].revenue || 0);

        const salesMonth = await axiosJWT.get(
          "http://localhost:4001/api/v1/dashboard/revenue-month/",
          config
        );
        setSalesMonth(salesMonth.data[0].revenue || 0);

        const statusData = await axiosJWT.get(
          "http://localhost:4001/api/v1/dashboard/status-data/",
          config
        );
        setStatusData(statusData.data);

        const salesData = await axiosJWT.get(
          "http://localhost:4001/api/v1/dashboard/daily-sales/",
          config
        );
        setDailySales(salesData.data);

        const recentOrdersData = await axiosJWT.get(
          "http://localhost:4001/api/v1/dashboard/recent-orders/",
          config
        );
        const ordersWithDateTime = recentOrdersData.data.map(
          (order: Orders) => {
            const dateTime = new Date(order.createdAt);
            const date = dateTime.toLocaleDateString();
            const time = dateTime.toLocaleTimeString();
            return { ...order, date, time };
          }
        );
        setRecentOrders(ordersWithDateTime);
        setIsLoading(false);
      } catch (error: any) {
        console.error(error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, adminCredentials.token]);

  useEffect(() => {
    setExpandedClass(!expanded ? "notExpanded" : "");
  }, [expanded]);

  return (
    <div id="Dashboard" className={`dashboard ${expandedClass}`}>
      <h1 className="ml-5 mt-5 font-semibold text-gray-800 text-3xl">
        DASHBOARD
      </h1>
      <br className="m-2" />

      {!isLoading ? (
        <>
          <div className="datacard-container">
            <DataCard
              title="TODAY'S ORDERS"
              content={todaysOrders}
              color="#2554da"
              icon={<IoCartSharp />}
              data-testid="orders-today"
            />
            <DataCard
              title="TODAY'S REVENUE"
              content={todaysRevenue}
              color="#a51ce6"
              icon={<BsGraphUpArrow />}
            />
            <DataCard
              title="SALES THIS MONTH"
              content={salesMonth}
              color="#008080"
              icon={<FaMoneyBillTrendUp />}
            />
          </div>

          <section className="charts-section">
            <div className="chart-container">
              <h2>Orders this Week</h2>
              <Chart
                options={pieOptions}
                series={pieOptions.series}
                type="pie"
                width="450"
                height="450"
                className="dashboard-charts"
              />
            </div>
            <div className="chart-container">
              <h2>Revenue this Week</h2>
              <Chart
                options={chartOptions}
                series={chartOptions.series}
                type="area"
                width="450"
                height="300"
                className="dashboard-charts"
              />
            </div>
          </section>
          <section className="table-section">
            <h3>Recent Orders</h3>
            <Table className="text-lg">
              <TableCaption>All of your orders</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Round Orders</TableHead>
                  <TableHead>Slim Orders</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date Ordered</TableHead>
                  <TableHead>Time Ordered</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.username}</TableCell>
                    <TableCell>{order.round}</TableCell>
                    <TableCell>{order.slim}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.time}</TableCell>
                    <TableCell>
                      {order.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {order.status === "confirmed" && (
                        <Badge variant="secondary">Confirmed</Badge>
                      )}
                      {order.status === "delivered" && <Badge>Delivered</Badge>}
                      {order.status === "for delivery" && (
                        <Badge>For Delivery</Badge>
                      )}
                      {order.status === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: 300, height: 300 }}
          />
        </div>
      )}
    </div>
  );
};

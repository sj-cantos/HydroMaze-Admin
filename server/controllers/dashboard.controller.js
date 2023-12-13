import { Orders } from "../database.js";
import { Customers } from "../database.js";

const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

console.log(start);
console.log(end);
const getOrdersToday = async (req, res) => {
  try {
    const ordersToday = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          count: 1
        }
      }
    ]);
    console.log(ordersToday);
    res.json(ordersToday);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
const getRecentOrders = async (req, res) => {
  try {
    // Get recent orders for current day
    const recentOrders = await Orders.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $limit: 5,
      },
    ]);
    console.log(recentOrders);
    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
const getCustomersToday = async (req, res) => {
  try {
    const customersToday = await Customers.find({
      createdAt: { $gte: start, $lt: end },
    });
    res.json(customersToday);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const getRevToday = async (req, res) => {
  try {
    const revenueToday = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end},
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$total",
          },
        },
      },
    ]);
    res.json(revenueToday);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const startWeekDate = start.setDate(start.getDate() - 7);

const getStatusData = async (req, res) => {
  try {
    const statusData = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: startWeekDate, $lt: end },
        },
      },
      {
        $group: {
          _id: "$createdAt",
          revenue: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    if (statusData.length === 0) {
      res.json({ status: 0 });
    } else {
      res.json(statusData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
const getDailySales = async (req, res) => {
  try {
    const dailySales = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: {
            $sum: "$total",
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    if (dailySales.length === 0) {
      res.json({ dailySales: 0 });
    } else {
      res.json(dailySales);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export {
  getOrdersToday,
  getCustomersToday,
  getRevToday,
  getStatusData,
  getDailySales,
  getRecentOrders,
};

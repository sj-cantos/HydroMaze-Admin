import { Orders } from "../database.js";
import { Customers } from "../database.js";

const today = new Date();
const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const end = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);

console.log(start);
console.log(end);
const getOrdersToday = async (req, res) => {
  try {
    const ordersToday = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ]);

    if (ordersToday.length !== 0) {
      res.json(ordersToday);
      console.log(ordersToday);
    } else {
      res.send([
        {
          _id: null,
          count: 0,
        },
      ]);
    }

    console.log("Successfully sent orders today");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
const getRecentOrders = async (req, res) => {
  try {
    // Get recent orders for current day
    const recentOrders = await Orders.aggregate([
      { $match: { status: "pending" } },
      { $sort: { createdAt: -1 } },
      {
        $limit: 5,
      },
    ]);
    console.log("Successfully sent recent orders");
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
          status: "delivered", 
          createdAt: { $gte: start, $lt: end },
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

    if (revenueToday.length !== 0) {
      res.json(revenueToday);
    } else {
      res.json([
        {
          _id: null,
          revenue: 0,
        },
      ]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const startWeekDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7
);
console.log(startWeekDate);
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
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    if (statusData.length === 0) {
      res.json([
        {
          _id: 0,
          count: 0,
        },
      ]);
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
          status: "delivered",
          createdAt: { $gte: startWeekDate, $lt: end },
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
      res.json([{ revenue: 0 }]);
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

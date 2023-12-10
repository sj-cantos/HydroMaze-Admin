import {Orders} from "../database.js";
import { Customers } from "../database.js";

var start = new Date();
start.setHours(0,0,0,0)
var end = new Date();
end.setHours(23,59,59,999)

const getOrdersToday = async (req, res) => {
    try {    
      const ordersToday = await Orders.find({createdAt: {$gte: start, $lt:end}});
      console.log(ordersToday);
      res.json(ordersToday);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  };

  const getCustomersToday = async (req, res) => {
    try {
      
      const customersToday = await Customers.find({createdAt:{$gte: start, $lt:end}});
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
            createdAt: { $gte: start, $lt: end }
          }
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$total"
            }
          }
        }
      ]);
      res.json(revenueToday);
      
    }catch(error){
      res.status(500).json({ message: error.message });
      console.log(error);
    }

  }

  var startWeekDate = start.setDate(start.getDate()-7);


  const getStatusData = async (req, res) => {
    try {
      const statusData = await Orders.aggregate([
        {
          $match: {
            createdAt: { $gte: startWeekDate, $lt: end }
          }
        },
        {
          $group: {
            _id: "$createdAt", // Grouping by status
            revenue: { $sum: 1 } // Counting occurrences of each status
          }
        },{
          "$project":{
            _id: 0,
            status: "$_id",
            count: 1
          }
         }
       
      ]);
      res.json(statusData);
      
    }catch(error){
      res.status(500).json({ message: error.message });
      console.log(error);
    }

  }
  const getDailySales = async (req, res) => {
    try {
      const statusData = await Orders.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lt: end }
          }
        },
        {
          $group: {
            _id: "$createdAt", 
            revenue: {
              $sum : "$total"
            } 
          }
        },{
          "$project":{
            _id: 0,
            date: "$_id",
            revenue: 1
          }
         }
       
      ]);
      res.json(statusData);
      
    }catch(error){
      res.status(500).json({ message: error.message });
      console.log(error);
    }

  }
  
  export { getOrdersToday, getCustomersToday, getRevToday, getStatusData, getDailySales};
  
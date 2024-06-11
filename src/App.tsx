import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/admn/Dashboard";
import Customer from "./pages/admn/Customers";
import Orders from "./pages/admn/Orders";
import Analytics from "./pages/admn/Analytics";
import "./App.css";

import { SidebarItem } from "./components/TestSidebar";
import NewSidebar from "./components/TestSidebar";

import { MdDashboard } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { IoMdAnalytics } from "react-icons/io";

import SidebarContext from "./SidebarContext";
import CustomerDetails from "./components/Customers/CustomerDetails";
import OrderDetails from "./components/Orders/OrderDetails";
import Login from "./pages/admn/Login";
import { useState } from "react";

function App() {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const routes = [
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/customers",
      element: <Customer />,
    },
    {
      path: "/orders",
      element: <Orders />,
    },
    {
      path: "/orders/:orderID",
      element: <OrderDetails />,
    },
    {
      path: "/analytics",
      element: <Analytics />,
    },
    {
      path: "/customers/details/:id",
      element: <CustomerDetails />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  const sidebarItems = [
    {
      icon: MdDashboard,
      text: "Dashboard",
      to: "/",
    },
    {
      icon: FaShoppingCart,
      text: "Orders",
      to: "/orders",
    },
    {
      icon: FaPerson,
      text: "Customers",
      to: "/customers",
    },
    {
      icon: IoMdAnalytics,
      text: "Analytics",
      to: "/analytics",
    },
  ];

  return (
  
      <SidebarContext.Provider 
        value={{
          expanded,
          activeItem,
          setExpanded,
          setActiveItem
        }}>
        <Router>
          <div className="flex">
            {isLoggedIn && (
              <NewSidebar>
                {sidebarItems.map((item, index) => (
                  <SidebarItem
                    icon={<item.icon />}
                    text={item.text}
                    to={item.to}
                    onItemClick={() => {
                      console.log(`Clicked on ${item.text}`);
                    }}
                    key={index}
                  />
                ))}
              </NewSidebar>
            )}
            <div className={isLoggedIn ? "pl-100" : ""}>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    path={route.path}
                    element={
                      route.path === "/login" ? (
                        route.element
                      ) : (
                        isLoggedIn ? route.element : <Navigate to="/login" />
                      )
                    }
                    key={index}
                  />
                ))}
              </Routes>
            </div>
          </div>
        </Router>
      </SidebarContext.Provider>
  
  );
}

export default App;

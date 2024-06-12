import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import { IoPersonCircleOutline } from "react-icons/io5";
import { AuthProvider, useAuth } from "./AuthContext";
import { useState } from "react";
function App() {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);

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
    <AuthProvider>
      <SidebarContext.Provider
        value={{
          expanded,
          activeItem,
          setExpanded,
          setActiveItem,
        }}
      >
        <Router>
          <div className="flex">
            <AuthWrapper sidebarItems={sidebarItems} />
          </div>
        </Router>
      </SidebarContext.Provider>
    </AuthProvider>
  );
}

const AuthWrapper = ({
  sidebarItems,
}: {
  sidebarItems: { icon: any; text: string; to: string }[];
}) => {
  const { isLoggedIn, adminCredentials, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {isLoggedIn && (
        <NewSidebar username={adminCredentials.username}>
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index} // Add key prop for performance
              icon={<item.icon />}
              text={item.text}
              to={item.to}
              onItemClick={() => console.log(`Clicked on ${item.text}`)}
            />
          ))}
        </NewSidebar>
      )}
      <div className={isLoggedIn ? "pl-100" : ""}>
        
        {isLoggedIn && (<div className="absolute z-20 top-8 right-10">
          <IoPersonCircleOutline
            size={30}
            onClick={() => {
              setShowPopup(!showPopup);
              console.log(showPopup);
            }}
          />
        </div>
         )}
        {isLoggedIn && showPopup && (
          <div className="absolute top-16 z-20 right-10 text-center">
            <button
              className=" w-20 p-2 bg-white border rounded shadow-lg text-xs hover:bg-gray-100"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        )}
        
     

        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderID" element={<OrderDetails />} />
              <Route path="/customers" element={<Customer />} />
              <Route
                path="/customers/details/:id"
                element={<CustomerDetails />}
              />
              <Route path="/analytics" element={<Analytics />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          {/* Redirect all unknown paths to home or login */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;

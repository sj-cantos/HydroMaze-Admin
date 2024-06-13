import React, { useContext, useEffect, useState, CSSProperties } from "react";
import { useLocation, useParams } from "react-router-dom";
import SidebarContext from "@/SidebarContext";
import { OrdersType } from "@/pages/admn/Orders";
import Map, { Marker } from "react-map-gl";
import { FaLocationDot } from "react-icons/fa6";
import "mapbox-gl/dist/mapbox-gl.css";
const initialViewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 10,
};

export default function OrderDetails() {
  const { expanded, setActiveItem } = useContext(SidebarContext);
  const { orderID } = useParams();
  const location = useLocation();
  const { order } = (location.state as { order: OrdersType }) || {};

  const [expandedStyle, setExpandedStyle] = useState<CSSProperties>({
    transition: "0.1s",
  });

  const [viewport, setViewport] = useState(initialViewport);
  useEffect(() => {
    setActiveItem("/orders");
  }, [setActiveItem]);

  useEffect(() => {
    setExpandedStyle({
      transition: "0.1s",
      left: expanded ? "0" : "70px",
      width: expanded ? "80vw" : "calc(100vw - 85px)",
    });
  }, [expanded]);

  return (
    <div className="relative" style={expandedStyle}>
      <h1 className="ml-5 mt-5 font-semibold text-gray-800 text-3xl">ORDERS</h1>
      <hr className="mt-2 mb-10" />
      <div className="ml-5 mr-10">
        <div className="ml-5 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-700">
            Order #{order._id}
          </div>
          <div className="text-gray-500">Order Placed at {order.date}</div>
        </div>

        <div className="rounded-md shadow-lg p-5 flex ">
          <div>
            <Map
              initialViewState={{
                longitude: order.location.longitude,
                latitude: order.location.latitude,
                zoom: 14,
              }}
              style={{ width: 500, height: 400 }}
              mapboxAccessToken="pk.eyJ1Ijoiam1hZ3dpbGkiLCJhIjoiY2xwaGZwaHh0MDJtOTJqbzVkanpvYjRkNSJ9.fZFeViJyigw6k1ebFAbTYA"
              mapStyle="mapbox://styles/mapbox/streets-v12"
            >
              <Marker
                latitude={order.location.latitude}
                longitude={order.location.longitude}
              >
                <FaLocationDot
                  style={{ height: "40px", width: "auto", color: "red" }}
                />
              </Marker>
            </Map>
          </div >
          <div className = "flex justify-between items-start"> 
          <div className="ml-5">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {order.username}
              <div>
                P {order.total}
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-2">
              Order Details
              <div >
                Slim: {order.slim}
                Round: {order.round}
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Delivery Address
              <div className="text-sm font-medium">
                {order.location.address}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

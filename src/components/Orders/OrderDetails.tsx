import SidebarContext from "@/SidebarContext"
import { useContext, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import { OrdersType } from "@/pages/admn/Orders"
import { useState } from "react"
import { CSSProperties } from "react"
export default function OrderDetails(){

    const { expanded, setActiveItem } = useContext(SidebarContext)
    const { orderID } = useParams()
    const location = useLocation()
    const { order } = location.state as { order: OrdersType } || {};
    const [expandedStyle, setExpandedStyle] = useState<CSSProperties>({
        transition: "0.1s",
      });
    useEffect(()=>{
        setActiveItem("/orders")
    })
    useEffect(() => {
        !expanded
          ? setExpandedStyle({
              left: "70px",
              width: "calc(100vw - 85px)",
              transition: "0.1s",
            })
          : setExpandedStyle({
              transition: "0.1s",
              width: "80vw",
            });
      }, [expanded]);
    

    return(
        <>
        <div className={`relative left-[285px]`} style={expandedStyle}>
            <h1 className="ml-5 mt-5 font-semibold text-gray-800 text-3xl">ORDERS</h1>
            <hr className="mt-2 mb-10" />
            <div className="ml-50">
            
        </div>
        </div>
       
        </>
    )
}
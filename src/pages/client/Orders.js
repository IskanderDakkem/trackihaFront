import React from "react";
import { useHistory } from "react-router-dom";
//------------------------------------------------------------------
import { Routes } from "../../Context/routes";
import useAuth from "../../Context/useAuth";
//------------------------------------------------------------------
import RouteWithSideBar from "../../CommunComponents/RouteWithSideBar";
import TableTitle from "./../../CommunComponents/TableTitle";
import OrdersContent from "./../../Views/client/Orders/OrdersContent";
//------------------------------------------------------------------
function Orders() {
  const Token = localStorage.getItem("Token");
  const { Auth } = useAuth();
  const navigate = useHistory();
  if (Token === null || Auth === null) {
    navigate.push(Routes.Signin.path);
  }
  return (
    <RouteWithSideBar>
      <TableTitle title={"Orders"} subTitle={"Your list of all your orders."} />
      <OrdersContent />
    </RouteWithSideBar>
  );
}
//------------------------------------------------------------------
export default Orders;

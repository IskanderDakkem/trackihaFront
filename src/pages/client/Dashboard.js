import React, { useState, useEffect } from "react";
//------------------------------------------------------------
import RouteWithSideBar from "../../CommunComponents/RouteWithSideBar";
//------------------------------------------------------------
import { useHistory } from "react-router-dom";
//------------------------------------------------------------
import useAuth from "../../Context/useAuth";
import { Routes } from "../../Context/routes";
import axios from "./../../Context/Axios";
import ApiLinks from "../../Context/ApiLinks";
import DashboardContent from "../../Views/client/dashboard/DashboardContent";
//------------------------------------------------------------
function Dashboard() {
  //--------------------------------------------------------------
  return (
    <RouteWithSideBar>
      <DashboardContent />
    </RouteWithSideBar>
  );
}
//------------------------------------------------------------
export default Dashboard;

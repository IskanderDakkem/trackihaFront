import React from "react";
import { useHistory } from "react-router-dom";
//--------------------------------------------------------------------------
import RouteWithSideBar from "../../CommunComponents/RouteWithSideBar";
import TableTitle from "./../../CommunComponents/TableTitle";
import StepsContent from "./../../Views/client/Steps/StepsContent";
//--------------------------------------------------------------------------
import useAuth from "../../Context/useAuth";
import { Routes } from "../../Context/routes";
//--------------------------------------------------------------------------
export default () => {
  const Token = localStorage.getItem("Token");
  const { Auth } = useAuth();
  const navigate = useHistory();
  if (Token === null || Auth === null) {
    navigate.push(Routes.Signin.path);
  }
  return (
    <RouteWithSideBar>
      <TableTitle title={"Steps"} subTitle={"Your list of all your steps."} />
      <StepsContent />
    </RouteWithSideBar>
  );
};
//--------------------------------------------------------------------------

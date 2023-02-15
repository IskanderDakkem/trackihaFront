import React from "react";
import { useHistory } from "react-router-dom";
//------------------------------------------------------------
import useAuth from "../../Context/useAuth";
import { Routes } from "../../Context/routes";
//------------------------------------------------------------
import RouteWithSideBar from "../../CommunComponents/RouteWithSideBar";
import TableTitle from "./../../CommunComponents/TableTitle";
import CompaniesContent from "./../../Views/client/Companies/CompaniesContent";
//------------------------------------------------------------
export default () => {
  const Token = localStorage.getItem("Token");
  const { Auth } = useAuth();
  const navigate = useHistory();
  if (Token === null || Auth === null) {
    navigate.push(Routes.Signin.path);
  }
  return (
    <RouteWithSideBar>
      <TableTitle
        title={"Companies"}
        subTitle={"Your list of all your companies."}
      />
      <CompaniesContent />
    </RouteWithSideBar>
  );
};
//------------------------------------------------------------

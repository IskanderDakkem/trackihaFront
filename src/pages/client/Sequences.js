import React from "react";
import { useHistory } from "react-router-dom";
//-------------------------------------------------------------------
import { Routes } from "../../Context/routes";
import useAuth from "../../Context/useAuth";
import SequenceContent from "./../../Views/client/Sequence/SequenceContent";
//-------------------------------------------------------------------
import RouteWithSideBar from "../../CommunComponents/RouteWithSideBar";
import TableTitle from "./../../CommunComponents/TableTitle";
//-------------------------------------------------------------------
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
        title={"Sequences"}
        subTitle={"Your list of all your sequences"}
      />
      <SequenceContent />
    </RouteWithSideBar>
  );
};
//-------------------------------------------------------------------

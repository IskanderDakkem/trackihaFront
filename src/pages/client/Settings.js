import React from "react";
//-------------------------------------------------------------------
import { Col, Row } from "@themesberg/react-bootstrap";
//-------------------------------------------------------------------
import TelUpdateForm from "./../../Views/client/settings/TelUpdateForm";
import EmailUpdateForm from "./../../Views/client/settings/EmailUpdateForm";
import PasswordUpdateForm from "./../../Views/client/settings/PasswordUpdateForm";
import UploadAvatar from "./../../Views/client/settings/UploadAvatar";
//-------------------------------------------------------------------
import RouteWithSideBar from "../../CommunComponents/RouteWithSideBar";
//-------------------------------------------------------------------
import { Routes } from "../../Context/routes";
import useAuth from "../../Context/useAuth";
import { useHistory } from "react-router-dom";
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
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4"></div>
      <Row>
        <Col xs={12} xl={8}>
          <TelUpdateForm />
          <EmailUpdateForm />
          <PasswordUpdateForm />
        </Col>

        <Col xs={12} xl={4}>
          <Row>
            <Col xs={12}>
              <UploadAvatar />
            </Col>
          </Row>
        </Col>
      </Row>
    </RouteWithSideBar>
  );
};
//-------------------------------------------------------------------

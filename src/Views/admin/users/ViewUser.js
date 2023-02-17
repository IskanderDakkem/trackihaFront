// ** react impors
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
// ** bootstrap imports
import { Tab, Nav } from "@themesberg/react-bootstrap";
// ** Parts
import TableTitle from "../../../CommunComponents/TableTitle";
import RouteWithAdminSideBar from "../../../CommunComponents/RouteWithAdminSideBar";
// ** Parts
import OrdersContent from "../../client/Orders/OrdersContent";
import CompaniesContent from "../../client/Companies/CompaniesContent";
import SequenceContent from "../../client/Sequence/SequenceContent";
import StepsContent from "../../client/Steps/StepsContent";
// ** Api config
import axios from "./../../../Context/Axios";
import ApiLinks from "./../../../Context/ApiLinks";
import useAuth from "../../../Context/useAuth";
import { Routes } from "../../../Context/routes";
// ----------------------------------------------------------------
function ViewUser() {
  // ** router
  const { setAuth } = useAuth();
  let Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** params
  const { id } = useParams();
  // ** initial state
  const defaultUser = {
    avatar: "",
    CompanyName: "",
    ResponsableName: "",
    Email: "",
    Tel: "",
    OfferName: "",
    companiesNumberAllowed: "",
    OrdersNumberAllowed: "",
    companiesCreated: "",
    createdAt: "",
  };
  // ** state
  const [user, setUsers] = useState({ ...defaultUser });
  // ** fetching data
  useEffect(() => {
    if (id !== null && id !== undefined && id !== 0) {
      getUser();
    }
  }, [id]);
  // ** functions
  const getUser = async () => {
    try {
      const res = await axios.get(ApiLinks.Users.getUser + id, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setUsers((prev) => ({ ...res?.data?.item }));
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** expired
      else if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
  };
  // ** ==>
  return (
    <RouteWithAdminSideBar>
      <TableTitle title={`Company: ${user?.CompanyName}`} />
      <Tab.Container defaultActiveKey="home">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          {/* <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
              Profile
            </Nav.Link>
          </Nav.Item> */}
          <Nav.Item>
            <Nav.Link eventKey="orders" className="mb-sm-3 mb-md-0">
              Orders
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="companies" className="mb-sm-3 mb-md-0">
              Companies
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="sequence" className="mb-sm-3 mb-md-0">
              Sequences
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="steps" className="mb-sm-3 mb-md-0">
              Steps
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {/*  <Tab.Pane eventKey="profile" className="py-4">
            <UserProfile profile={user} />
          </Tab.Pane> */}
          <Tab.Pane eventKey="orders" className="py-4">
            {/* <OrdersContent clientId={id} /> */}
          </Tab.Pane>
          <Tab.Pane eventKey="companies" className="py-4">
            <CompaniesContent clientId={id} />
          </Tab.Pane>
          <Tab.Pane eventKey="sequence" className="py-4">
            <SequenceContent clientId={id} />
          </Tab.Pane>
          <Tab.Pane eventKey="steps" className="py-4">
            <StepsContent clientId={id} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </RouteWithAdminSideBar>
  );
}

export default ViewUser;

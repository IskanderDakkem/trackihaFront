import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faChartLine,
  faCloudUploadAlt,
  faPlus,
  faRocket,
  faTasks,
  faUserShield,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Button,
  Dropdown,
  ButtonGroup,
} from "@themesberg/react-bootstrap";
// --------------------------------------------------------------------------
import {
  CounterWidget,
  CircleChartWidget,
  BarChartWidget,
  TeamMembersWidget,
  ProgressTrackWidget,
  RankingWidget,
  SalesValueWidget,
  SalesValueWidgetPhone,
  AcquisitionWidget,
} from "../../../components/Widgets";
import { PageVisitsTable } from "../../../components/Tables";
// --------------------------------------------------------------------------
import { trafficShares, totalOrders } from "../../../data/charts";
import axios from "./../../../Context/Axios";
import ApiLinks from "../../../Context/ApiLinks";
import { useEffect } from "react";
import CountOrdersWidget from "./widget/CountOrdersWidget";
import useAuth from "./../../../Context/useAuth";
import OrdersStatesChart from "./widget/OrdersStatesChart";
import OrdersEvolutionWidget from "./widget/OrdersEvolutionWidget";

// --------------------------------------------------------------------------
function DashboardContent() {
  const { Auth } = useAuth();
  let Token = localStorage.getItem("Token");
  // ------------------------------------------------------------------------
  const [orders, setOrders] = useState([]);
  const [ordersEvolution, setOrdersEvolution] = useState({
    labels: [],
    series: [],
    percentage: 0,
  });
  // ------------------------------------------------------------------------
  const getAllOrders = async () => {
    try {
      const res = await axios.get(ApiLinks.Orders.getAllAtOnce + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setOrders([...res?.data?.items]);
      }
    } catch (error) {
      // catching errors
    }
  };
  const getOrdersEvolution = async () => {
    try {
      const res = await axios.get(ApiLinks.Orders.getOrderEvolution + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setOrdersEvolution({ ...res?.data?.item });
      }
    } catch (error) {
      // Catching
    }
  };
  useEffect(() => {
    getAllOrders();
    getOrdersEvolution();
  }, []);
  // ------------------------------------------------------------------------
  const getOrdersNumber = (ordersNumber) => {
    return ordersNumber;
  };
  const getOrdersPeriode = (orders) => {
    if (orders.length === 0) {
      return "";
    }
    return `${new Date(orders[0].createdAt).toDateString()} - ${new Date(
      orders[orders.length - 1].createdAt
    ).toDateString()}`;
  };
  const getOrderEvolutionSinceLastMonth = (orders) => {
    return 0;
  };
  // ------------------------------------------------------------------------
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Dropdown className="btn-toolbar">
          {/* <Dropdown.Toggle
            as={Button}
            variant="primary"
            size="sm"
            className="me-2"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            New Task
          </Dropdown.Toggle> */}
          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faTasks} className="me-2" /> New Task
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" />{" "}
              Upload Files
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faUserShield} className="me-2" /> Preview
              Security
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faRocket} className="text-danger me-2" />{" "}
              Upgrade to Pro
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <ButtonGroup>
          <Button variant="outline-primary" size="sm">
            Share
          </Button>
          <Button variant="outline-primary" size="sm">
            Export
          </Button>
        </ButtonGroup>
      </div>

      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <OrdersEvolutionWidget
            title="Orders evolution for the last six month"
            percentage={ordersEvolution?.percentage}
            data={ordersEvolution}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CountOrdersWidget
            category="Orders"
            title={getOrdersNumber(orders.length)}
            period={getOrdersPeriode(orders)}
            percentage={getOrderEvolutionSinceLastMonth(orders)}
            icon={faHandHoldingUsd}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <OrdersStatesChart title="Orders state" orders={orders} />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <BarChartWidget
            title="Total orders"
            value={452}
            percentage={18.2}
            data={totalOrders}
          />
        </Col>
      </Row>
    </>
  );
}

export default DashboardContent;

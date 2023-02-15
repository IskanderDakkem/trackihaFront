import React from "react";
// ----------------------------------------------------------------------
import { Col, Row, Card } from "@themesberg/react-bootstrap";
// ----------------------------------------------------------------------
import { CircleChart } from "../../../../components/Charts";
// ----------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBan,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
// ----------------------------------------------------------------------
function OrdersStatesChart(props) {
  // ** default array
  const tracker = [
    { id: 1, label: "Delivered", value: 0, color: "success", icon: faCheck },
    { id: 2, label: "Pending", value: 0, color: "primary", icon: faTruck },
    { id: 3, label: "Late", value: 0, color: "warning", icon: faClock },
    { id: 4, label: "Canceled", value: 0, color: "danger", icon: faBan },
  ];
  const { title, orders = [] } = props; // ** props
  // ** count the order states
  const countOrderStates = (orders) => {
    orders.forEach((item) => {
      const { isLivraison, deliveryDate, isRetarded, IsCancel } = item;
      // ** delivered orders
      if (isLivraison === true && deliveryDate !== null) {
        tracker[1 - 1].value = tracker[1 - 1].value + 1;
      }
      // ** Pending orders
      else if (!isLivraison && !isRetarded && !IsCancel) {
        tracker[2 - 1].value = tracker[1 - 1].value + 1;
      }
      // ** Late orders
      else if (item?.isRetarded === true) {
        tracker[3 - 1].value = tracker[1 - 1].value + 1;
      }
      // ** canceled orders
      else if (item?.IsCancel === true) {
        tracker[4 - 1].value = tracker[1 - 1].value + 1;
      }
    });
    return [...tracker];
  };
  const data = countOrderStates(orders);
  const series = data.map((d) => d.value / orders.length);
  // ----------------------------------------------------------------------
  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Row className="d-block d-xl-flex align-items-center">
          <Col
            xs={12}
            xl={5}
            className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0"
          >
            <CircleChart series={series} />
          </Col>
          <Col xs={12} xl={7} className="px-xl-0">
            <h5 className="mb-3">{title}</h5>

            {data.map((d) => (
              <h6
                key={`circle-element-${d.id}`}
                className="fw-normal text-gray"
              >
                <FontAwesomeIcon
                  icon={d.icon}
                  className={`icon icon-xs text-${d.color} w-20 me-1`}
                />
                {` ${d.label} `}
                {`${d.value * 100}%`}
              </h6>
            ))}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default OrdersStatesChart;

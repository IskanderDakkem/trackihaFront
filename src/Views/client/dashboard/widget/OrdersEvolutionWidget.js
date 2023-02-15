// ** React imports
import React from "react";
// ** Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@themesberg/react-bootstrap";
import { SalesValueChart } from "../../../../components/Charts";
// ------------------------------------------------------------------
function OrdersEvolutionWidget(props) {
  const { title, percentage, data } = props;
  const percentageIcon = percentage < 0 ? faAngleDown : faAngleUp;
  const percentageColor = percentage < 0 ? "text-danger" : "text-success";
  return (
    <Card className="bg-secondary-alt shadow-sm">
      <Card.Header className="d-flex flex-row align-items-center flex-0">
        <div className="d-block">
          <h5 className="fw-normal mb-2">{title}</h5>
          {/* <h3>{value}</h3> */}
          <small className="fw-bold mt-2">
            <span className="me-2">Last month</span>
            <FontAwesomeIcon
              icon={percentageIcon}
              className={`${percentageColor} me-1`}
            />
            <span className={percentageColor}>{percentage}%</span>
          </small>
        </div>
      </Card.Header>
      <Card.Body className="p-2">
        <SalesValueChart data={data} />
      </Card.Body>
    </Card>
  );
}

export default OrdersEvolutionWidget;

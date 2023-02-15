import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faChartArea,
  faChartBar,
  faChartLine,
  faFlagUsa,
  faFolderOpen,
  faGlobeEurope,
  faPaperclip,
  /* faUserPlus, */
} from "@fortawesome/free-solid-svg-icons";
import {
  faAngular,
  faBootstrap,
  faReact,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";
import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
} from "@themesberg/react-bootstrap";
function CountOrdersWidget(props) {
  const { icon, iconColor, category, title, period, percentage } = props;
  const percentageIcon = percentage < 0 ? faAngleDown : faAngleUp;
  const percentageColor = percentage < 0 ? "text-danger" : "text-success";
  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Row className="d-block d-xl-flex align-items-center">
          <Col
            xl={5}
            className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0"
          >
            <div
              className={`icon icon-shape icon-md icon-${iconColor} rounded me-4 me-sm-0`}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className="d-sm-none">
              <h5>{category}</h5>
              <h3 className="mb-1">{title}</h3>
            </div>
          </Col>
          <Col xs={12} xl={7} className="px-xl-0">
            <div className="d-none d-sm-block">
              <h5>{category}</h5>
              <h3 className="mb-1">{title}</h3>
            </div>
            {period.length > 0 && (
              <small>
                {period}, <FontAwesomeIcon icon={faGlobeEurope} size="xs" />{" "}
              </small>
            )}
            <div className="small mt-2">
              <FontAwesomeIcon
                icon={percentageIcon}
                className={`${percentageColor} me-1`}
              />
              <span className={`${percentageColor} fw-bold`}>
                {percentage}%
              </span>{" "}
              Since last month
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CountOrdersWidget;

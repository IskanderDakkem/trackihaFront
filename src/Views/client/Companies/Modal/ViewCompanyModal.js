// ** React imports
import React from "react";
// ** bootstrap imports
import { Modal, Button, Form, Col } from "@themesberg/react-bootstrap";
//-----------------------------------------------------------------
function ViewCompanyModal({
  showViewCompanyModal,
  setShowViewCompanyModal,
  SelectedCompany,
}) {
  if (Object.keys(SelectedCompany).length === 0) {
    return null;
  }
  const {
    id,
    CompanyName,
    CompanyResponsable,
    CompanyEmail,
    PhoneNumber,
    ordersAllowed,
    ordersCreated,
    createdAt,
    updatedAt,
  } = SelectedCompany;
  // ** on close
  const onHide = () => {
    setShowViewCompanyModal(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showViewCompanyModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Company detailes</h5>
        <Form>
          {/* {logo !== null && (
            <Col>
              <img
                src={BASE_PATH + logo}
                alt={"#"}
                style={{ height: "70px" }}
              />
            </Col>
          )} */}
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>#: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{id}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Name: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{CompanyName}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Responsable: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{CompanyResponsable}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Email: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{CompanyEmail}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Phone Number: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{`+${PhoneNumber}`}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Orders allowed: </Form.Label>&nbsp; &nbsp;
              <span
                className={`text-${
                  ordersAllowed === -1
                    ? "success"
                    : ordersAllowed === 0
                    ? "danger"
                    : "info"
                }`}
              >
                {ordersAllowed || 0}
              </span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Orders count: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{ordersCreated}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Orders remaining: </Form.Label>&nbsp; &nbsp;
              <span className={`text-${"info"}`}>{0}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Created at: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </Form.Group>
          </Col>
          {updatedAt !== null && (
            <Col className="mb-3">
              <Form.Group>
                <Form.Label>Updated At: </Form.Label>&nbsp; &nbsp;
                <span className="text-info">
                  {new Date(updatedAt).toLocaleDateString()}
                </span>
              </Form.Group>
            </Col>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
//---------------------------------------------------------
export default ViewCompanyModal;

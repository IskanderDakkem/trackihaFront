import React from "react";
import {
  Modal,
  Button,
  Form,
  Col,
  InputGroup,
} from "@themesberg/react-bootstrap";
/* import { BASE_PATH } from "../Context/Axios"; */
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
    createdAt,
    /*  ordersAllowed,
    ordersCreated,
    createdAt, */
    //ordersLeft,
  } = SelectedCompany;
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showViewCompanyModal}
      onHide={() => setShowViewCompanyModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowViewCompanyModal(false)}
        />
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
              <Form.Label>id</Form.Label>
              <InputGroup>
                <Form.Control value={id} disabled={true} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <InputGroup>
                <Form.Control value={CompanyName} disabled={true} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Responsable</Form.Label>
              <InputGroup>
                <Form.Control value={CompanyResponsable} disabled={true} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control value={CompanyEmail} disabled={true} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <Form.Control value={PhoneNumber} disabled={true} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Created At</Form.Label>
              <InputGroup>
                <Form.Control
                  value={new Date(createdAt).toDateString()}
                  disabled={true}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
//---------------------------------------------------------
export default ViewCompanyModal;

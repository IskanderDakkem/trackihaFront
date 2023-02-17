import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------
function CreateOfferModal({ showCreateOfferModal, setShowCreateOfferModal }) {
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  //-----------------------------------------------------------------
  const [apiLoading, setApiLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //-----------------------------------------------------------------
  const initialeState = {
    name: "",
    companies: 0,
    orders: 0,
  };
  const [newOffer, setNewOffer] = useState(initialeState);
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewOffer({ ...newOffer, [name]: value });
  };
  //-----------------------------------------------------------------
  const onSubmitNewCompany = async (event) => {
    event.preventDefault();
    setBackErrors({});
    setInputErrors({});
    setInputErrors(validate(newOffer));
    setApiLoading(true);
    if (Object.keys(inputErrors).length === 0) {
      await axios
        .post(ApiLinks.offers.create, newOffer, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 201) {
            setShowCreateOfferModal(false);
            setNewOffer(initialeState);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors({ ...backErrors, ops: "Something went wrong" });
          }
          if (err?.response?.status === 401) {
            /* setAuth(null);
            localStorage.removeItem("Token"); */
            navigate.push(Routes.SigninAdmin.path);
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 406) {
            setBackErrors({
              required: "All informations are required!",
            });
          }
          if (err?.response?.status === 409) {
            setBackErrors({
              CompanyEmail: "This email is already used!",
            });
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
    setApiLoading(false);
  };
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.CompanyEmail = "Email is required!";
    }
    return errors;
  };
  //-----------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateOfferModal}
      onHide={() => setShowCreateOfferModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowCreateOfferModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create an offer</h5>
        <Form>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Offer Name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={newOffer?.name}
                  onChange={onChange}
                  placeholder="Offer name ..."
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.name && (
              <Alert variant="danger">{inputErrors.name}</Alert>
            )}
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Companies number</Form.Label>
              <InputGroup id="email">
                <Form.Control
                  required
                  type="number"
                  name="companies"
                  value={newOffer?.companies}
                  min={-1}
                  onChange={onChange}
                  placeholder="Companies number"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Orders number</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="number"
                  name="orders"
                  value={newOffer?.orders}
                  min={-1}
                  onChange={onChange}
                  placeholder="Orders number"
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Form>
        {backErrors.ops && <Alert variant="danger">{backErrors.ops}</Alert>}
        {backErrors.required && (
          <Alert variant="danger">{backErrors.required}</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowCreateOfferModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="text-white btn btn-success"
          type="submit"
          onClick={onSubmitNewCompany}
        >
          {apiLoading ? (
            <Spinner animation="border" variant="dark" />
          ) : (
            "Create"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateOfferModal;

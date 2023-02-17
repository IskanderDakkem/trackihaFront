//** React imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------
//** styles imports
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
//---------------------------------------------------------------------
//**Api config */
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------------------
function CreateCompanyModal({
  showCreateCompanyModal,
  setShowCreateCompanyModal,
  setShowCreateCompanyToast,
  refresh,
}) {
  // ** router
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** initiale state
  const defaultCompany = {
    CompanyName: "",
    CompanyResponsable: "",
    CompanyEmail: "",
    PhoneNumber: "",
  };
  // ** states
  const [apiLoading, setApiLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newCompany, setNewCompany] = useState({
    ...defaultCompany,
  });
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewCompany({ ...newCompany, [name]: value });
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiLoading(true);
    const frontErrors = validate(newCompany);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.post(
          ApiLinks.Company.create + Auth,
          newCompany,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 201) {
          onHide(); // close modal
          setShowCreateCompanyToast(true); // open toast
          refresh();
        }
      } catch (err) {
        // ** failed to create
        if (err?.response?.status === 400) {
          setErrors({ ...errors, ops: "Something went wrong" });
        }
        // ** no token
        else if (err?.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** expired token
        else if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** email already used
        if (
          err?.response?.status === 409 &&
          err?.response?.data.code === "CompanyEmail"
        ) {
          setErrors({
            CompanyEmail: "This email is already used!",
          });
        }
        // ** phone number already used
        else if (
          err?.response?.status === 409 &&
          err?.response?.data.code === "PhoneNumber"
        ) {
          setErrors({
            PhoneNumber: "This phone number is already used!",
          });
        }
        // ** server errors
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setApiLoading(false);
  };

  // ** validate form
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    //Validate company email existant
    if (!values.CompanyEmail) {
      errors.CompanyEmail = "Email is required!";
    }
    // validate email format
    else if (!regex.test(values.CompanyEmail)) {
      errors.CompanyEmail = "This is not a valid email format!";
    }
    //validate the company name
    if (!values.CompanyName) {
      errors.CompanyName = "Company name is required!";
    }
    //Validate the company responsable name
    if (!values.CompanyResponsable) {
      errors.CompanyResponsable =
        "The responsable for this comapany name is required!";
    }
    //Validate the phone number
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Phone number is required!";
    }
    // validate phone number format
    else if (!values.PhoneNumber.match("[0-9]{10}")) {
      errors.PhoneNumber = "Please provide valid phone number!";
    }
    return errors;
  };
  // ** reset form
  const onHide = () => {
    setShowCreateCompanyModal(false);
    setNewCompany({ ...defaultCompany });
    setErrors({});
  };
  //-----------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateCompanyModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create a company</h5>
        <Form onSubmit={onSubmit}>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="CompanyName"
                  value={newCompany?.CompanyName}
                  onChange={onChange}
                  placeholder="Enter your company name"
                  isInvalid={errors.CompanyName && true}
                  required
                  autoFocus
                />
              </InputGroup>
            </Form.Group>
            {errors.CompanyName && (
              <FormFeedback className="d-block">
                {errors.CompanyName}
              </FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group id="responsableName">
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup id="responsableName">
                <Form.Control
                  type="text"
                  name="CompanyResponsable"
                  value={newCompany?.CompanyResponsable}
                  onChange={onChange}
                  placeholder="Enter your the responsable name"
                  isInvalid={errors.CompanyResponsable && true}
                  required
                />
              </InputGroup>
            </Form.Group>
            {errors.CompanyResponsable && (
              <FormFeedback className="d-block">
                {errors.CompanyResponsable}
              </FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="CompanyEmail"
                  value={newCompany?.CompanyEmail}
                  onChange={onChange}
                  placeholder="Enter your company email"
                  isInvalid={errors.CompanyEmail && true}
                  required
                />
              </InputGroup>
            </Form.Group>
            {errors.CompanyEmail && (
              <FormFeedback className="d-block">
                {errors.CompanyEmail}
              </FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group id="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="+XX-XXX XXX XXX"
                name="PhoneNumber"
                value={newCompany?.PhoneNumber}
                onChange={onChange}
                isInvalid={errors.PhoneNumber && true}
                required
              />
            </Form.Group>
            {errors.PhoneNumber && (
              <FormFeedback className="d-block">
                {errors.PhoneNumber}
              </FormFeedback>
            )}
          </Col>
          {errors.ops && (
            <Alert variant="danger" className="my-2">
              {errors.ops}
            </Alert>
          )}
          <Col xs={12} className="text-center mt-4 mb-3 pt-50">
            <Button
              variant="link"
              className="text-white ms-auto btn btn-danger me-2"
              onClick={onHide}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              className="btn btn-success"
              type="submit"
            >
              {apiLoading ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Create"
              )}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
//-----------------------------------------------------------------
export default CreateCompanyModal;

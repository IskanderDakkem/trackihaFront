import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------
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
//---------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------
function UpdateCompanyModal({
  showUpdateCompanyModal,
  setShowUpdateCompanyModal,
  setShowUpdateCompanyToast,
  SelectedCompany,
  refresh,
}) {
  // ** router
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  // ** states
  const [apiLoading, setApiLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [updateCompany, setUpdateCompany] = useState({});
  // ** fetch data
  useEffect(() => {
    if (
      showUpdateCompanyModal &&
      SelectedCompany !== 0 &&
      SelectedCompany !== undefined
    ) {
      getOneCompany();
    }
  }, [SelectedCompany]);
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setUpdateCompany({ ...updateCompany, [name]: value });
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiLoading(true);
    const frontErrors = validate(updateCompany);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.put(
          ApiLinks.Company.update + SelectedCompany + "/" + Auth,
          updateCompany,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        console.log("res: ", res.data);
        if (res?.status === 202) {
          onHide(); //  close
          setShowUpdateCompanyToast(true); // open toast
          refresh(); // refresh
        }
      } catch (err) {
        // ** bad request
        if (err?.response?.status === 400) {
          setErrors({
            ...errors,
            ops: "Something went wrong",
          });
        }
        // ** no token
        else if (err?.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // **  token expired
        else if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** email already used
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === "EMAIL"
        ) {
          setErrors({
            CompanyEmail: "This email is already used by an other company",
          });
        }
        // ** email already used
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === "PhoneNumber"
        ) {
          setErrors({
            PhoneNumber:
              "This phone number is already used by an other company",
          });
        }
        // ** server error
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setApiLoading(false);
  };
  // ** functions
  const getOneCompany = async () => {
    try {
      const res = await axios.get(
        ApiLinks.Company.getSpecificCompany + SelectedCompany,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        setUpdateCompany((prev) => ({ ...res?.data?.item }));
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // **
      else if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** company not found
      else if (err?.response?.status === 400) {
        onHide();
      }
      // ** server Error
      else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
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
    setShowUpdateCompanyModal(false);
    setUpdateCompany({});
    setErrors({});
  };
  //---------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateCompanyModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Update a company</h5>
        <Form onSubmit={onSubmit}>
          <Col className="mb-3">
            <Form.Group id="companyName">
              <Form.Label>Company Name</Form.Label>
              <InputGroup id="companyName">
                <Form.Control
                  type="text"
                  name="CompanyName"
                  value={updateCompany?.CompanyName}
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
                  value={updateCompany?.CompanyResponsable}
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
                  value={updateCompany?.CompanyEmail}
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
                value={updateCompany?.PhoneNumber}
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
                "Update"
              )}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
//---------------------------------------------------------
export default UpdateCompanyModal;

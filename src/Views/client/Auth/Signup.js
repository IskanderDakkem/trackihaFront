// ** react imports
import React, { useState } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
// ** icons imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faEnvelope,
  faBuilding,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import BgImage from "../../../assets/img/illustrations/signin.svg";
// ** bootstrap imports
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  FormCheck,
  Container,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// **  API config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//---------------------------------------------------------------------------------
export default () => {
  // ** router
  const { Auth } = useAuth();
  const { state } = useLocation();
  if (Auth !== null) {
    return <Redirect to={state?.from || Routes.Home.path} />;
  }
  const navigate = useHistory();
  // ** Initial state
  const initialState = {
    Email: "",
    CompanyName: "",
    ResponsableName: "",
    Tel: "",
  };
  // ** states
  const [errors, setErrors] = useState({});
  const [apiLoading, setApiLoading] = useState(false);
  const [successfullyCreated, setSuccessfullyCreated] = useState(false);
  const [newUser, setNewUser] = useState({ ...initialState });
  // ** on Change
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };
  // ** on Submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiLoading(true);
    const frontErrors = validate(newUser);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.post(ApiLinks.Auth.signup, newUser);
        if (res?.status === 201) {
          setSuccessfullyCreated(true);
        }
      } catch (err) {
        //
        if (err?.response?.status === 409 && err?.response?.data?.code === 1) {
          setErrors({
            Email: "This email is already used!",
          });
        }
        //
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === 2
        ) {
          setErrors({
            Tel: "This phone number is already used!",
          });
        }
        //
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setApiLoading(false);
  };
  // ** on validate
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    //Validate email
    if (!values.Email) {
      errors.Email = "Email is required!";
    } else if (!regex.test(values.Email)) {
      errors.Email = "This is not a valid email format!";
    }
    //Validate companyName
    if (!values.CompanyName) {
      errors.CompanyName = "Company name is required!";
    }
    //Validate responsable name
    if (!values.ResponsableName) {
      errors.ResponsableName = "Responsable name is required!";
    }
    //validate phone number
    if (!values.Tel) {
      errors.Tel = "Phone number is required!";
    } else if (!values.Tel.match("[0-9]{10}")) {
      errors.Tel = "this is not a valid phone number format!";
    }
    return errors;
  };
  // ** ==>
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          {/* <p className="text-center">
            <Card.Link
              as={Link}
              to={Routes.Signin.path}
              className="text-gray-700"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to
              login
            </Card.Link>
          </p> */}
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Create an account</h3>
                </div>
                <Form className="mt-4" onSubmit={onSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Your Company Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faBuilding} />
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        type="text"
                        name="CompanyName"
                        value={newUser.CompanyName}
                        onChange={onChange}
                        isInvalid={errors.CompanyName && true}
                        placeholder="company name"
                        required
                      />
                    </InputGroup>
                    {errors.CompanyName && (
                      <FormFeedback className="d-block">
                        {errors.CompanyName}
                      </FormFeedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Responsable Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="ResponsableName"
                        value={newUser.ResponsableName}
                        onChange={onChange}
                        placeholder="Responsable name"
                        isInvalid={errors.ResponsableName && true}
                        required
                      />
                    </InputGroup>
                    {errors.ResponsableName && (
                      <FormFeedback className="d-block">
                        {errors.ResponsableName}
                      </FormFeedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="Email"
                        value={newUser.Email}
                        onChange={onChange}
                        isInvalid={errors.Email && true}
                        placeholder="example@company.com"
                        required
                      />
                    </InputGroup>
                    {errors.Email && (
                      <FormFeedback className="d-block">
                        {errors.Email}
                      </FormFeedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Your Phone Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faPhone} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="Tel"
                        value={newUser.Tel}
                        onChange={onChange}
                        placeholder="Phone Number"
                        isInvalid={errors.Tel && true}
                        required
                      />
                    </InputGroup>
                    {errors.Tel && (
                      <FormFeedback className="d-block">
                        {errors.Tel}
                      </FormFeedback>
                    )}
                  </Form.Group>

                  <FormCheck type="checkbox" className="d-flex mb-4">
                    <FormCheck.Input required id="terms" className="me-2" />
                    <FormCheck.Label htmlFor="terms">
                      I agree to the <Card.Link>terms and conditions</Card.Link>
                    </FormCheck.Label>
                  </FormCheck>
                  {successfullyCreated && (
                    <Alert variant="success" className="mt-2 mb-3 text-center">
                      Account was successfully created, Please check your
                      account for further instructions
                    </Alert>
                  )}
                  <Button variant="primary" type="submit" className="w-100">
                    {apiLoading ? (
                      <Spinner animation="border" variant="dark" />
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </Form>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Already have an account?
                    <Card.Link
                      as={Link}
                      to={Routes.Signin.path}
                      className="fw-bold"
                    >
                      {` Login here `}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
//--------------------------------------------------------------------

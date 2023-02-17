// ** react imports
import React, { useState } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
// ** ** icons imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
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
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** Api config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//---------------------------------------------------------------------------------
export default () => {
  // ** Routing settings
  const { Auth } = useAuth();
  const { state } = useLocation();
  const navigate = useHistory();
  if (Auth !== null) {
    return <Redirect to={state?.from || Routes.Home.path} />;
  }
  // ** errors states
  const [errors, setErrors] = useState({});
  const [apiLoading, setApiLoading] = useState(false);
  // ** initial state
  const initialState = {
    Email: "",
    Password: "",
    remember: false,
  };
  // ** states
  const [user, setUser] = useState({
    ...initialState,
  });
  // ** on Change
  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  // ** on Submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiLoading(true);
    const frontErrors = validate(user);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.post(ApiLinks.Auth.login, user);
        if (res?.status === 200) {
          const Token = res?.data?.Token;
          if (Token) {
            localStorage.setItem("Token", Token);
            navigate.push(Routes.Home.path);
          }
        }
      } catch (err) {
        // ** user doesn't exists
        if (err?.response?.status === 409) {
          setErrors({
            Email: "This's user doesn't exist",
          });
          setUser({ ...user, Email: "", Password: "" });
        }
        // ** wrong password
        else if (err?.response?.status === 401) {
          setErrors({
            Password: "This's user doesn't exist",
          });
          setUser({ ...user, Password: "" });
        }
        // ** server error
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setApiLoading(false);
  };
  // ** validater
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // exist
    if (!values.Email) {
      errors.Email = "Email is required!";
    }
    // format
    else if (!regex.test(values.Email)) {
      errors.Email = "This is not a valid email format!";
    }
    // exist
    if (!values.Password) {
      errors.Password = "Password is required";
    }
    // value
    else if (values.Password.length < 6) {
      errors.Password = "Password must be more than 6 characters";
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
              homepage
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
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to our platform</h3>
                </div>
                <Form className="mt-4" onSubmit={onSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        type="email"
                        placeholder="example@company.com"
                        isInvalid={errors.Email && true}
                        name="Email"
                        value={user?.Email}
                        onChange={onChange}
                        required
                      />
                    </InputGroup>
                    {errors.Email && (
                      <FormFeedback className="d-block">
                        {errors.Email}
                      </FormFeedback>
                    )}
                  </Form.Group>

                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="Password"
                          value={user?.Password}
                          onChange={onChange}
                          isInvalid={errors.Password && true}
                          required
                        />
                      </InputGroup>
                      {errors.Password && (
                        <FormFeedback className="d-block">
                          {errors.Password}
                        </FormFeedback>
                      )}
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check>
                        <FormCheck.Input
                          type="checkbox"
                          className="me-2"
                          defaultValue={true}
                          name="remember"
                          onChange={onChange}
                        />
                        <FormCheck.Label
                          htmlFor="defaultCheck5"
                          className="mb-0"
                        >
                          Remember me
                        </FormCheck.Label>
                      </Form.Check>
                      <Card.Link
                        as={Link}
                        className="small text-end"
                        to={Routes.ForgotPassword.path}
                      >
                        Lost password?
                      </Card.Link>
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    {apiLoading ? (
                      <Spinner animation="border" variant="dark" />
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Form>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Not registered?
                    <Card.Link
                      as={Link}
                      to={Routes.Signup.path}
                      className="fw-bold"
                    >
                      {` Create account `}
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
  //--------------------------------------------------------------
};

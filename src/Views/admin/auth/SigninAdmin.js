import React, { useState } from "react";
//--------------------------------------------------------------
import jwt from "jwt-decode";
//--------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Form,
  Button,
  Container,
  InputGroup,
} from "@themesberg/react-bootstrap";
//--------------------------------------------------------------
import { Alert } from "@themesberg/react-bootstrap";
import { Redirect, useHistory, useLocation } from "react-router-dom";
//--------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//---------------------------------------------------------------------------------
export default () => {
  const { Auth, setAuth } = useAuth();
  const { state } = useLocation();
  const navigate = useHistory();
  /* if (Auth === true) {
    return <Redirect to={state?.from || Routes.Home.path} />;
  } */
  //--------------------------------------------------------------
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const onChangeSigninUser = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  //--------------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [isWrong, setIsWrong] = useState(false);
  //--------------------------------------------------------------
  const onSubmitSigninHandler = async (event) => {
    event.preventDefault();
    setBackErrors({});
    setInputErrors({});
    setIsWrong(false);
    if (Object.keys(inputErrors).length === 0) {
      await axios
        .post(ApiLinks.Admin.Signin, user)
        .then((res) => {
          if (res?.status === 200) {
            localStorage.setItem("Token", res?.data?.Token); //Save token
            setAuth(0); //update global state
            navigate.push(Routes.HomeAdmin.path); //Navigate to home page
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            setUser((prev) => ({ ...user, password: "" }));
            setBackErrors({
              ...backErrors,
              wrong: "Wrong password",
            });
          }
          if (err.response.status === 406) {
            setUser((prev) => ({ email: "", password: "" }));
            setBackErrors({
              ...backErrors,
              wrong: "Provide all required informations",
            });
          }
          if (err.response.status === 409) {
            setUser((prev) => ({ email: "", password: "" }));
            setBackErrors({
              ...backErrors,
              wrong: "This credentials are wrong. Please try again",
            });
          }
        });
    }
  };
  //--------------------------------------------------------------
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row
            className="justify-content-center form-bg-image"
            /* style={{ backgroundImage: `url(${BgImage})` }} */
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                {/* <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to our platform</h3>
                </div> */}
                <Form className="mt-4" onSubmit={onSubmitSigninHandler}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        required
                        type="email"
                        placeholder="example@company.com"
                        name="email"
                        value={user?.email}
                        onChange={onChangeSigninUser}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control
                          required
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={user?.password}
                          onChange={onChangeSigninUser}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Form.Group>
                  {backErrors.wrong && (
                    <Alert variant="danger">{backErrors.wrong}</Alert>
                  )}
                  {isWrong && <Alert variant="danger">Password is wrong</Alert>}
                  <Button variant="primary" type="submit" className="w-100">
                    Sign in
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
  //--------------------------------------------------------------
};

// ** react imports
import React, { useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
// ** icons imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
// ** bootstrap imports
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Container,
  InputGroup,
  Alert,
} from "@themesberg/react-bootstrap";
// ** API config
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
  // ** Email
  const [Email, setEmail] = useState("");
  // ** Input errors
  const [emailController, setEmailController] = useState("");
  // ** Successfully sent
  const [successfully, setSuccessfully] = useState("");
  //Submit new email
  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccessfully("");
    setEmailController("");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (Email.length === 0) {
      setEmailController("Email is required!");
    } else if (!regex.test(Email)) {
      setEmailController("This is not a valid email format!");
    }
    await axios
      .post(ApiLinks.Auth.forgotPassword, { Email })
      .then((res) => {
        if (res?.status === 200) {
          setSuccessfully(
            "A link was sent to your email to reset your password"
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status === 406) {
          setEmailController("Email is required!");
        }
        // User doesn't exist
        else if (err?.reponse?.status === 409) {
          setEmailController("This user doesn't exist");
        }
        // server error
        else if (err.response.status === 500) {
          setEmailController("Server error");
        }
      });
    setTimeout(() => {
      setSuccessfully("");
      setEmailController("");
      setEmail("");
    }, 5000);
  };
  return (
    <main>
      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link
                as={Link}
                to={Routes.Signin.path}
                className="text-gray-700"
              >
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to
                sign in
              </Card.Link>
            </p>
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3>Forgot your password?</h3>
                <p className="mb-4">
                  Just type in your email and we will send you a link to reset
                  your email
                </p>
                <Form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <Form.Label htmlFor="email-forgot-password-input">
                      Your Email
                    </Form.Label>
                    <InputGroup id="email-forgot-password-input">
                      <Form.Control
                        type="email"
                        name="Email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        autoFocus
                        required
                      />
                    </InputGroup>
                  </div>
                  {emailController.length !== 0 && (
                    <Alert variant="danger">{emailController}</Alert>
                  )}
                  {successfully.length !== 0 && (
                    <Alert variant="success">{successfully}</Alert>
                  )}
                  <Button variant="primary" type="submit" className="w-100">
                    Recover password
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

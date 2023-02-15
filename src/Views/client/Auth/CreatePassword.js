import React, { useState } from "react";
import {
  Link,
  useParams,
  useLocation,
  useHistory,
  Redirect,
} from "react-router-dom";
//---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
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
//---------------------------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//---------------------------------------------------------------------------------
function CreatePassword() {
  // ** route config
  const navigate = useHistory();
  const { Auth } = useAuth();
  const { state } = useLocation();
  // ** get token from params
  const { token } = useParams();
  /* if (Auth !== null) {
    return <Redirect to={state?.from || Routes.Home.path} />;
  } */
  // ** initial State
  const initialState = {
    Password: "",
    confirmPassword: "",
  };
  const [newPassword, setNewPassword] = useState({ ...initialState });
  const [inputErrors, setInput] = useState({});
  // ** on Change
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewPassword({ ...newPassword, [name]: value });
  };
  // ** on Submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setInput({});
    setInput(validate(newPassword));
    if (Object.keys(inputErrors).length === 0) {
      await axios
        .put(ApiLinks.Auth.CreatePassword + token, newPassword)
        .then((res) => {
          if (res?.status === 200) {
            setInput((prev) => ({
              ...prev,
              success: "Password was created successfully",
            }));
            // ** save token in localStorage
            const Token = localStorage.setItem("Token", res?.data?.Token);
            localStorage.setItem("Token", Token);
            setTimeout(() => {
              navigate.push(Routes.Home.path);
            }, 1000);
          }
        })
        .catch((err) => {
          // Failed to update the password
          if (err?.response?.status === 400) {
            setInput((prev) => ({
              ...prev,
              back: "Failed to update, Something went wrong",
            }));
          }
          // token invalide
          else if (err?.response?.status === 401) {
            setInput((prev) => ({
              ...prev,
              back: "This link was expired, Please try an other link",
            }));
          }
          // undefined route
          else if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          // Password not provided
          else if (err?.response?.status === 406) {
            setInput((prev) => ({
              ...prev,
              back: "Please provide the password",
            }));
          }
          // User doesn't exist
          else if (err?.response?.status === 409) {
            setInput((prev) => ({
              ...prev,
              back: "Something went wrong, Please try again",
            }));
          }
          // Server error
          else if (err?.response?.status === 500) {
            navigate.push(Routes.NotFound.path);
          }
        });
    }
  };
  // ** Validate input.
  const validate = (values) => {
    const errors = {};
    if (!values.Password) {
      errors.password = "Password is required!";
    } else if (values.Password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Password is required!";
    } else if (values.confirmPassword.length < 6) {
      errors.confirmPassword = "Password must be at least 6 characters";
    }
    if (values.Password !== values.confirmPassword) {
      errors.match = "The two passwords don't match";
    }
    return errors;
  };
  return (
    <main>
      <section className="bg-soft d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link
                as={Link}
                to={Routes.Signup.path}
                className="text-gray-700"
              >
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to
                sign up
              </Card.Link>
            </p>
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3 className="mb-4">Create your account password</h3>
                <Form onSubmit={onSubmit}>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Your Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="Password"
                        value={newPassword?.Password}
                        onChange={onChange}
                        placeholder="New password"
                        required
                        autoFocus
                      />
                    </InputGroup>
                  </Form.Group>
                  {inputErrors.Password && (
                    <Alert variant="danger">{inputErrors.Password}</Alert>
                  )}
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        required
                        type="password"
                        name="confirmPassword"
                        value={newPassword.confirmPassword}
                        onChange={onChange}
                        placeholder="Confirm password"
                      />
                    </InputGroup>
                  </Form.Group>
                  {inputErrors.confirmPassword && (
                    <Alert variant="danger">
                      {inputErrors.confirmPassword}
                    </Alert>
                  )}
                  {inputErrors.match && (
                    <Alert variant="danger">{inputErrors.match}</Alert>
                  )}
                  {inputErrors.back && (
                    <Alert variant="danger">{inputErrors.back}</Alert>
                  )}
                  {inputErrors.success && (
                    <Alert variant="success">{inputErrors.success}</Alert>
                  )}
                  <Button variant="primary" type="submit" className="w-100">
                    Create password
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default CreatePassword;

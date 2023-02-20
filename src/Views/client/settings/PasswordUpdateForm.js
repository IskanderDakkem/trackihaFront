// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import {
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** API config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//-------------------------------------------------------
function PasswordUpdateForm() {
  // ** router
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  // ** initial state
  const initialPassword = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [newPassword, setNewPassword] = useState({
    ...initialPassword,
  });
  const [errors, setErrors] = useState({});
  const [successfully, setSuccessfully] = useState("");
  // ** on changes
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewPassword({ ...newPassword, [name]: value });
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoadingButton(false);
    setErrors({});
    const frontErrors = validate(newPassword);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.put(
          ApiLinks.User.updatePassword + Auth,
          newPassword,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 200) {
          setSuccessfully("The password has been updated successfully");
          setTimeout(() => {
            onReset();
            setSuccessfully("");
          }, 4000);
        }
      } catch (err) {
        // ** failed to create
        if (err?.response?.status === 400) {
          setErrors({
            confirmNewPassword:
              "Ops! Can't delete, Something is missing please refresh the page",
          });
        }
        // no token
        else if (err?.reponse?.status === 401) {
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // expired
        else if (err?.reponse?.status === 403) {
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // server error
        else if (err?.reponse?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setLoadingButton(false);
  };
  //-------------------------------------------------------
  const validate = (values) => {
    const errors = {};
    if (!values.oldPassword) {
      errors.oldPassword = "The old password is required!";
    } else if (values.oldPassword.length < 6) {
      errors.oldPassword = "The old password must be at least 6 characters";
    }

    if (!values.newPassword) {
      errors.newPassword = "The new password is required!";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "The new password must be at least 6 characters";
    }

    if (!values.confirmNewPassword) {
      errors.confirmNewPassword =
        "The confirming the new password is required!";
    } else if (values.confirmNewPassword !== values.newPassword) {
      errors.confirmNewPassword = "the two passwords need to match";
    } else if (values.confirmNewPassword.length < 6) {
      errors.confirmNewPassword =
        "The new password must be at least 6 characters";
    }
    return errors;
  };
  // ** on reset
  const onReset = () => {
    setNewPassword({ ...initialPassword });
  };
  //-------------------------------------------------------
  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Update Password</h5>
          <Form>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your old password"
                  name="oldPassword"
                  value={newPassword?.oldPassword}
                  onChange={onChange}
                  isInvalid={errors.oldPassword && true}
                  required
                  autoFocus
                />
              </Form.Group>
              {errors.oldPassword && (
                <FormFeedback className="d-block">
                  {errors.oldPassword}
                </FormFeedback>
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Enter your new password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your company name"
                  name="newPassword"
                  value={newPassword?.newPassword}
                  onChange={onChange}
                  isInvalid={errors.newPassword && true}
                  required
                />
              </Form.Group>
              {errors.newPassword && (
                <FormFeedback className="d-block">
                  {errors.newPassword}
                </FormFeedback>
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="lastName">
                <Form.Label>Confirm your new password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="confirmNewPassword"
                  value={newPassword?.confirmNewPassword}
                  onChange={onChange}
                  isInvalid={errors.confirmNewPassword && true}
                  required
                />
              </Form.Group>
              {errors.confirmNewPassword && (
                <FormFeedback className="d-block">
                  {errors.confirmNewPassword}
                </FormFeedback>
              )}
            </Col>
            <div className="mt-3">
              <Button variant="primary" type="submit" onClick={onSubmit}>
                {loadingButton ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Form>
          {successfully.length !== 0 && (
            <Alert variant="success">{successfully}</Alert>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default PasswordUpdateForm;

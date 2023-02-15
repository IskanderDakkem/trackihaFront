import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//-------------------------------------------------------
import {
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
//-------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//-------------------------------------------------------
function PasswordUpdateForm() {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  //-------------------------------------------------------
  const [newPassword, setNewPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  //-------------------------------------------------------
  const onChangeNewPassword = (event) => {
    const { name, value } = event.target;
    setNewPassword({ ...newPassword, [name]: value });
  };
  //-------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [successfully, setSuccessfully] = useState("");
  //-------------------------------------------------------
  const handleSubmitUpdatePassword = async (event) => {
    event.preventDefault();
    setLoadingButton(false);
    setInputErrors({});
    setBackErrors({});
    setInputErrors(validate(newPassword));
    if (Object.keys(inputErrors).length === 0) {
      setLoadingButton(true);
      await axios
        .put(ApiLinks.User.updatePassword + Auth, newPassword, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSuccessfully("The password has been updated successfully");
            setTimeout(() => {
              setNewPassword({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
              setSuccessfully("");
            }, 4000);
            window.location.reload();
          }
        })
        .catch((err) => {
          setInputErrors({});
          if (err?.reponse?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.reponse?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.reponse?.status === 406) {
            setBackErrors({
              backErrors,
              required: "all informations are required!",
            });
          }
          if (err?.reponse?.status === 422) {
            setBackErrors({
              ...backErrors,
              confirmNewPassword: "The two passwords don't match",
            });
            setNewPassword({
              ...backErrors,
              confirmNewPassword: "",
            });
          }
          if (err?.reponse?.status === 400) {
            setBackErrors({
              ...backErrors,
              oldPassword: "This password is wrong",
            });
            setNewPassword({
              ...backErrors,
              oldPassword: "",
            });
          }
          if (err?.reponse?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.reponse?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
      setLoadingButton(false);
    }
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
                  onChange={onChangeNewPassword}
                />
              </Form.Group>
              {inputErrors?.oldPassword && (
                <Alert variant="danger">{inputErrors?.oldPassword}</Alert>
              )}
              {backErrors?.oldPassword && (
                <Alert variant="danger">{backErrors?.oldPassword}</Alert>
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
                  onChange={onChangeNewPassword}
                />
              </Form.Group>
              {inputErrors?.newPassword && (
                <Alert variant="danger">{inputErrors?.newPassword}</Alert>
              )}
              {backErrors?.newPassword && (
                <Alert variant="danger">{backErrors?.newPassword}</Alert>
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
                  onChange={onChangeNewPassword}
                />
              </Form.Group>
              {inputErrors?.confirmNewPassword && (
                <Alert variant="danger">
                  {inputErrors?.confirmNewPassword}
                </Alert>
              )}
              {backErrors?.confirmNewPassword && (
                <Alert variant="danger">{backErrors?.confirmNewPassword}</Alert>
              )}
            </Col>
            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitUpdatePassword}
              >
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
          {backErrors.required && (
            <Alert variant="success">{backErrors.required}</Alert>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default PasswordUpdateForm;

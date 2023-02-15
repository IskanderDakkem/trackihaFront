import React, { useState, useEffect } from "react";
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
function EmailUpdateForm() {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  //-------------------------------------------------------
  const [userInfo, setUserInfo] = useState({});
  const getUserInfo = async () => {
    await axios
      .get(ApiLinks.User.getUser + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setUserInfo((prev) => ({ Email: res?.data?.item?.Email }));
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  useEffect(() => {
    if (Auth !== null && Auth !== undefined && Auth !== 0) {
      getUserInfo();
    }
  }, []);
  //-------------------------------------------------------
  const [newEmail, setNewEmail] = useState({
    newEmail: "",
    confirmNewEmail: "",
  });
  const onChangeNewEmail = (event) => {
    const { name, value } = event.target;
    setNewEmail({ ...newEmail, [name]: value });
  };
  //-------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({}); //Front errors
  const [backErrors, setBackErrors] = useState({}); //Back errors
  const [successfully, setSuccessfully] = useState(""); //successfully updated
  //-------------------------------------------------------
  const handleSubmitUpdateEmail = async (event) => {
    event.preventDefault();
    setInputErrors({});
    setBackErrors({});
    setInputErrors(validate(newEmail));
    if (Object.keys(inputErrors).length === 0) {
      setLoadingButton(true);
      await axios
        .put(ApiLinks.User.updateEmail + Auth, newEmail, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSuccessfully("The email has been updated successfully");
            setTimeout(() => {
              setNewEmail({
                newEmail: "",
                confirmNewEmail: "",
              });
              setSuccessfully("");
            }, 4000);
            window.location.reload();
          }
        })
        .catch((err) => {
          setInputErrors({});
          if (err?.response?.status === 400) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 406) {
            setBackErrors({
              backErrors,
              required: "all informations are required!",
            });
          }
          if (err?.response?.status === 422) {
            setBackErrors({
              ...backErrors,
              confirmNewEmail: "The two emails don't match",
            });
            setNewEmail({
              ...backErrors,
              confirmNewEmail: "",
            });
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
      setLoadingButton(false);
    }
  };
  //-------------------------------------------------------
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.newEmail) {
      errors.newEmail = "Email is required!";
    } else if (!regex.test(values.newEmail)) {
      errors.newEmail = "This is not a valid email format!";
    }

    if (!values.confirmNewEmail) {
      errors.confirmNewEmail = "Email is required!";
    } else if (!regex.test(values.newEmail)) {
      errors.confirmNewEmail = "This is not a valid email format!";
    }

    if (values.newEmail !== values.confirmNewEmail) {
      errors.confirmNewEmail = "Two email don't match!";
    }
    return errors;
  };
  //-------------------------------------------------------
  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Update Email</h5>
          <Form>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>New Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={`${userInfo?.Email}`}
                  name="newEmail"
                  value={newEmail?.newEmail}
                  onChange={onChangeNewEmail}
                />
              </Form.Group>
              {inputErrors?.newEmail && (
                <Alert variant="danger">{inputErrors?.newEmail}</Alert>
              )}
              {backErrors?.newEmail && (
                <Alert variant="danger">{backErrors?.newEmail}</Alert>
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Confirm your new email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Confirm your new email"
                  name="confirmNewEmail"
                  value={newEmail?.confirmNewEmail}
                  onChange={onChangeNewEmail}
                />
              </Form.Group>
              {inputErrors?.confirmNewEmail && (
                <Alert variant="danger">{inputErrors?.confirmNewEmail}</Alert>
              )}
              {backErrors?.confirmNewEmail && (
                <Alert variant="danger">{backErrors?.confirmNewEmail}</Alert>
              )}
            </Col>
            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitUpdateEmail}
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

export default EmailUpdateForm;

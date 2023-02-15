import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//------------------------------------------------------------------------
import {
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
//------------------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//------------------------------------------------------------------------
function TelUpdateForm() {
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
        const { status } = res;
        if (status === 200) {
          const { Tel } = res?.data?.item;
          setUserInfo((prev) => ({ Tel }));
        }
      })
      .catch((err) => {
        if (err?.reponse?.status === 400) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
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
        if (err?.reponse?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.reponse?.status === 500) {
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
  const [newTel, setNewTel] = useState({
    newTel: "",
    confirmNewTel: "",
  });
  const onChangenewTel = (event) => {
    const { name, value } = event.target;
    setNewTel({ ...newTel, [name]: value });
  };
  //-------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [successfully, setSuccessfully] = useState("");
  //-------------------------------------------------------
  const handleSubmitUpdateEmail = async (event) => {
    event.preventDefault();
    setLoadingButton(false);
    setInputErrors({});
    setBackErrors({});
    setInputErrors(validate(newTel));
    if (Object.keys(inputErrors).length === 0) {
      setLoadingButton(true);
      await axios
        .put(ApiLinks.User.updateTel + Auth, newTel, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSuccessfully("The phone number has been updated successfully");
            setTimeout(() => {
              setNewTel({
                newTel: "",
                confirmNewTel: "",
              });
              setSuccessfully("");
            }, 4000);
            window.location.reload();
          }
        })
        .catch((err) => {
          setInputErrors("");
          if (err?.response?.status === 400) {
            setBackErrors("Something went wrong try again");
          } else if (err?.response?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          } else if (err?.response?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          } else if (err?.response?.status === 406) {
            setBackErrors("The new company name is required!");
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
    if (!values.newTel) {
      errors.newTel = "Phone number is required!";
    } else if (!values.newTel.match("[0-9]{10}")) {
      errors.newTel = "this is not a valid phone number format!";
    }
    if (!values.confirmNewTel) {
      errors.confirmNewTel = "Phone number is required!";
    } else if (!values.confirmNewTel.match("[0-9]{10}")) {
      errors.confirmNewTel = "this is not a valid phone number format!";
    }
    return errors;
  };
  //-------------------------------------------------------
  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Update your phone number</h5>
          <Form>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>New phone number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`${userInfo?.Tel}`}
                  name="newTel"
                  value={newTel?.newTel}
                  onChange={onChangenewTel}
                />
              </Form.Group>
              {inputErrors?.newTel && (
                <Alert variant="danger">{inputErrors?.newTel}</Alert>
              )}
              {backErrors?.newTel && (
                <Alert variant="danger">{backErrors?.newTel}</Alert>
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Confirm your new phone number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Confirm your new phone number"
                  name="confirmNewTel"
                  value={newTel?.confirmNewTel}
                  onChange={onChangenewTel}
                />
              </Form.Group>
              {inputErrors?.confirmNewTel && (
                <Alert variant="danger">{inputErrors?.confirmNewTel}</Alert>
              )}
              {backErrors?.confirmNewTel && (
                <Alert variant="danger">{backErrors?.confirmNewTel}</Alert>
              )}
            </Col>
            <div className="mt-3">
              <Button variant="primary" onClick={handleSubmitUpdateEmail}>
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
          {successfully?.length !== 0 && (
            <Alert variant="success" className="mt-1">
              {successfully}
            </Alert>
          )}
          {backErrors?.required && (
            <Alert variant="success" className="mt-1">
              {backErrors.required}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default TelUpdateForm;

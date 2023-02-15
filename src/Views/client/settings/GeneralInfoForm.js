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
function GeneralInfoForm() {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
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
          const { ResponsableName, CompanyName } = res?.data?.item;
          setUserInfo((prev) => ({ ResponsableName, CompanyName }));
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
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newResponsableName, setNewResponsableName] = useState("");
  //-------------------------------------------------------
  const [inputErrorsForm1, setInputErrorsForm1] = useState("");
  const [backErrorsForm1, setBackErrorsForm1] = useState("");
  //-------------------------------------------------------
  const [inputErrorsForm2, setInputErrorsForm2] = useState("");
  const [backErrorsForm2, setBackErrorsForm2] = useState("");
  const [successfully, setSuccessfully] = useState("");
  //-------------------------------------------------------

  const handleSubmitNewResponsableName = async (event) => {
    event.preventDefault();
    setInputErrorsForm1("");
    setBackErrorsForm1("");
    setLoadingButton(false);
    setInputErrorsForm1(validateResponsabemName(newResponsableName));
    if (inputErrorsForm1.length !== 0) {
      setLoadingButton(true);
      await axios
        .put(ApiLinks.User.updateResponsableName + Auth, newResponsableName, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSuccessfully(
              "The responsable name has been updated successfully"
            );
            setTimeout(() => {
              setNewResponsableName("");
              setSuccessfully("");
            }, 4000);
          }
        })
        .catch((err) => {
          setInputErrorsForm1("");
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
            setBackErrorsForm1("The new responsable name is required!");
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
    setLoadingButton(false);
  };
  //-------------------------------------------------------
  const handleSubmitNewCompanyName = async (event) => {
    event.preventDefault();
    setInputErrorsForm2("");
    setBackErrorsForm1("");
    setLoadingButton(false);
    setInputErrorsForm2(validateCompanyName(newCompanyName));
    if (inputErrorsForm2.length !== 0) {
      setLoadingButton(true);
      await axios
        .put(ApiLinks.User.updateCompanyName + Auth, newCompanyName, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          const { status } = res;
          if (status === 200) {
            setSuccessfully("The company name has been updated successfully");
            setTimeout(() => {
              setNewCompanyName("");
              setSuccessfully("");
            }, 4000);
          }
        })
        .catch((err) => {
          setInputErrorsForm2("");
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
            setInputErrorsForm2("The new company name is required!");
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
    setLoadingButton(false);
  };
  //-------------------------------------------------------
  const validateCompanyName = (values) => {
    let errors = "";
    if (!values) {
      errors = "Company name is required!";
    }
    return errors;
  };
  //-------------------------------------------------------
  const validateResponsabemName = (values) => {
    let errors = "";
    if (!values) {
      errors = "Responsable name is required!";
    }
    return errors;
  };
  //-------------------------------------------------------
  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Update Responsable name</h5>
          {/* Form one=> updating the resposable name */}
          <Form>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>New Responsable name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Current name is ${userInfo?.ResponsableName}`}
                  value={newResponsableName}
                  onChange={(e) => setNewResponsableName(e.target.value)}
                />
              </Form.Group>
              {inputErrorsForm2.length !== 0 && (
                <Alert variant="danger">{inputErrorsForm2}</Alert>
              )}
              {inputErrorsForm2.length !== 0 && (
                <Alert variant="danger">{inputErrorsForm2}</Alert>
              )}
            </Col>
            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitNewCompanyName}
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
          {/* {backErrors.length !== 0 && (
            <Alert variant="success">{backErrors}</Alert>
          )} */}
        </Card.Body>
      </Card>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Update the company name</h5>
          {/* Form one=> updating the company name */}
          <Form>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>New company name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Current name is ${userInfo?.CompanyName}`}
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                />
              </Form.Group>
              {inputErrorsForm1.length !== 0 && (
                <Alert variant="danger">{inputErrorsForm1}</Alert>
              )}
              {backErrorsForm1.length !== 0 && (
                <Alert variant="danger">{backErrorsForm1}</Alert>
              )}
            </Col>
            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitNewResponsableName}
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
          {inputErrorsForm2.length !== 0 && (
            <Alert variant="success">{inputErrorsForm2}</Alert>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default GeneralInfoForm;

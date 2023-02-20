// ** react imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// **  bootstrap imports
import {
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** api config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//-------------------------------------------------------
function EmailUpdateForm() {
  // ** router
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  // ** initial states
  const intialEmail = {
    newEmail: "",
    confirmNewEmail: "",
  };
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [newEmail, setNewEmail] = useState({ ...intialEmail });
  const [successfully, setSuccessfully] = useState(""); //successfully updated
  const [errors, setErrors] = useState({});
  // ** fetching data
  useEffect(() => {
    if (Auth !== null && Auth !== undefined && Auth !== 0) {
      getUserInfo();
    }
  }, []);
  // ** functions
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
  // ** on Change
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewEmail({ ...newEmail, [name]: value });
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoadingButton(true);
    console.log("reacehd here");
    const frontErrors = validate(newEmail);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
      console.log("here ?");
    }
    if (Object.keys(frontErrors).length === 0) {
      console.log("No, Here ?");
      try {
        const res = await axios.put(
          ApiLinks.User.updateEmail + Auth,
          newEmail,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 200) {
          setSuccessfully("Email was updated successfully");
          onReset();
          // content
        }
      } catch (err) {
        // failed
        if (err?.response?.status === 400) {
          setErrors({
            confirmNewEmail:
              "Ops! Can't update something is missing, Please refresh the page",
          });
        }
        // no token
        else if (err?.response?.status === 401) {
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // expired
        else if (err?.response?.status === 403) {
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // email already used
        if (err?.response?.status === 409) {
          setErrors({
            confirmNewEmail: "This email is already used",
          });
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setLoadingButton(false);
  };
  // ** validate form
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // exist
    if (values.newEmail === "") {
      errors.newEmail = "Email is required!";
    }
    // format
    else if (!regex.test(values.newEmail)) {
      errors.newEmail = "This is not a valid email format!";
    }
    // exist
    if (!values.confirmNewEmail === "") {
      errors.confirmNewEmail = "Email is required!";
    }
    // format
    else if (!regex.test(values.newEmail)) {
      errors.confirmNewEmail = "This is not a valid email format!";
    }
    // matching
    if (values.newEmail !== values.confirmNewEmail) {
      errors.confirmNewEmail = "Two email don't match!";
    }
    return errors;
  };
  // ** on reset
  const onReset = () => {
    setNewEmail({ ...intialEmail });
    setErrors({});
  };
  // ** ==>
  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Update Email</h5>
          <Form onSubmit={onSubmit}>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>New Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={`${userInfo?.Email}`}
                  name="newEmail"
                  value={newEmail?.newEmail}
                  onChange={onChange}
                  isInvalid={errors.newEmail && true}
                  required
                />
              </Form.Group>
              {errors.newEmail && (
                <FormFeedback className="d-block">
                  {errors.newEmail}
                </FormFeedback>
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
                  onChange={onChange}
                  isInvalid={errors.confirmNewEmail && true}
                  required
                  autoFocus
                />
              </Form.Group>
              {errors.confirmNewEmail && (
                <FormFeedback className="d-block">
                  {errors.confirmNewEmail}
                </FormFeedback>
              )}
            </Col>
            <div className="mt-3">
              <Button variant="primary" type="submit" className="mt-1">
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

export default EmailUpdateForm;

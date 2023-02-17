// ** reaact imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** Api config
import axios from "../../../../Context/Axios";
import ApiLinks from "./../../../../Context/ApiLinks";
import { Routes } from "./../../../../Context/routes";
//---------------------------------------------------------------------
function UpdateUserModal({
  showUpdateUserModal,
  setShowUpdateUserModal,
  selectedUser,
  setShowUpdateUserToast,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** states
  const [apiLoading, setApiLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({});
  // ** fetching data
  useEffect(() => {
    if (
      showUpdateUserModal &&
      selectedUser !== null &&
      selectedUser !== undefined &&
      selectedUser !== 0
    ) {
      getUser();
    }
  }, [showUpdateUserModal]);
  /* const [offers, setOffers] = useState([]);
  const getOffers = async () => {
    await axios
      .get(ApiLinks.offers.getAll, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setOffers((prev) => res?.data?.items);
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getOffers();
  }, [showUpdateUserModal]); */
  // ** functions
  const getUser = async () => {
    try {
      // content
      const res = await axios.get(ApiLinks.Users.getUser + selectedUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setNewUser((prev) => ({ ...res?.data?.item }));
      }
    } catch (err) {
      // expired
      if (err?.response?.status === 401) {
        navigate.push(Routes.SigninAdmin.path);
        localStorage.removeItem("Token");
      }
      // expired
      else if (err?.response?.status === 403) {
        navigate.push(Routes.SigninAdmin.path);
        localStorage.removeItem("Token");
      }
      // server error
      else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
  };
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiLoading(true);
    const frontErrors = validate(newUser);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        console.log(ApiLinks.Users.Update + selectedUser);
        const res = await axios.put(
          ApiLinks.Users.Update + selectedUser,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 202) {
          onHide();
          refresh();
          setShowUpdateUserToast(true);
        }
      } catch (err) {
        // no token
        if (err?.response?.status === 401) {
          navigate.push(Routes.SigninAdmin.path);
          localStorage.removeItem("Token");
        }
        // expired
        else if (err?.response?.status === 403) {
          navigate.push(Routes.SigninAdmin.path);
          localStorage.removeItem("Token");
        }
        //
        if (err?.response?.status === 409 && err?.response?.data?.code === 1) {
          setErrors({
            Email: "This email is already used!",
          });
        }
        //
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === 2
        ) {
          setErrors({
            Tel: "This phone number is already used!",
          });
        }
        //
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setApiLoading(false);
  };
  // ** validate form
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    //Validate email
    if (!values.Email) {
      errors.Email = "Email is required!";
    } else if (!regex.test(values.Email)) {
      errors.Email = "This is not a valid email format!";
    }
    //Validate companyName
    if (!values.CompanyName) {
      errors.CompanyName = "Company name is required!";
    }
    //Validate responsable name
    if (!values.ResponsableName) {
      errors.ResponsableName = "Responsable name is required!";
    }
    //validate phone number
    if (!values.Tel) {
      errors.Tel = "Phone number is required!";
    } else if (!values.Tel.match("[0-9]{10}")) {
      errors.Tel = "this is not a valid phone number format!";
    }
    return errors;
  };
  // ** on close
  const onHide = () => {
    setShowUpdateUserModal();
    setNewUser({});
    setErrors({});
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateUserModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create this user</h5>
        <Form onSubmit={onSubmit}>
          <Col /* md={6} */ className="mb-3">
            <Form.Group className="mb-4">
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="CompanyName"
                  value={newUser.CompanyName}
                  onChange={onChange}
                  isInvalid={errors.CompanyName && true}
                  placeholder="company name ..."
                  required
                  autoFocus
                />
              </InputGroup>
              {errors.CompanyName && (
                <FormFeedback className="d-block">
                  {errors.CompanyName}
                </FormFeedback>
              )}
            </Form.Group>
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group className="mb-4">
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="ResponsableName"
                  value={newUser.ResponsableName}
                  onChange={onChange}
                  placeholder="Responsable name ..."
                  isInvalid={errors.ResponsableName && true}
                  required
                />
              </InputGroup>
              {errors.ResponsableName && (
                <FormFeedback className="d-block">
                  {errors.ResponsableName}
                </FormFeedback>
              )}
            </Form.Group>
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="Email"
                  value={newUser.Email}
                  onChange={onChange}
                  isInvalid={errors.Email && true}
                  placeholder="example@company.com"
                  required
                />
              </InputGroup>
              {errors.Email && (
                <FormFeedback className="d-block">{errors.Email}</FormFeedback>
              )}
            </Form.Group>
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group className="mb-4">
              <Form.Label>Your Phone Number</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="Tel"
                  value={newUser.Tel}
                  onChange={onChange}
                  placeholder="+XX-XXX XXX XXX"
                  isInvalid={errors.Tel && true}
                  required
                />
              </InputGroup>
              {errors.Tel && (
                <FormFeedback className="d-block">{errors.Tel}</FormFeedback>
              )}
            </Form.Group>
          </Col>
          <Col xs={12} className="text-center mt-4 mb-3 pt-50">
            <Button
              variant="link"
              className="text-white ms-auto btn btn-danger me-2"
              onClick={onHide}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              className="btn btn-success"
              type="submit"
            >
              {apiLoading ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Update"
              )}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateUserModal;

import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
/* import { BASE_PATH } from "../../../../Context/Axios";
import useAuth from "../../../../Context/useAuth"; */
//---------------------------------------------------------------------
function UpdateUserModal({
  showUpdateUserModal,
  setShowUpdateUserModal,
  selectedUser,
  setShowUpdateUserToast,
}) {
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //-----------------------------------------------------------------
  const [apiLoading, setApiLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //-----------------------------------------------------------------
  const [offers, setOffers] = useState([]);
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
  }, [showUpdateUserModal]);
  //-----------------------------------------------------------------
  const initialeState = {};
  const [newUser, setNewUser] = useState(initialeState);
  const getUser = async () => {
    await axios
      .get(ApiLinks.Users.getUser + selectedUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setNewUser((prev) => res?.data?.item);
        }
      })
      .catch((err) => {
        console.log("update user: ", selectedUser);
        /* if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        } */
      });
  };
  useEffect(() => {
    if (
      selectedUser !== null &&
      selectedUser !== undefined &&
      selectedUser !== 0
    ) {
      getUser();
    }
  }, [showUpdateUserModal, selectedUser]);
  const onChangeNewUser = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };
  //-----------------------------------------------------------------
  const onSubmitNewUser = async (event) => {
    event.preventDefault();
    setBackErrors({});
    setInputErrors({});
    setInputErrors(validate(newUser));
    setApiLoading(true);
    if (Object.keys(inputErrors).length === 0) {
      await axios
        .put(ApiLinks.Users.update + selectedUser, newUser, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          setShowUpdateUserModal(false);
          setNewUser(initialeState);
          setShowUpdateUserToast(true);
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors({ ...backErrors, ops: "Something went wrong" });
          }
          if (err?.response?.status === 401) {
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 403) {
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 406) {
            setBackErrors({
              ...backErrors,
              required: "All informations are required!",
            });
          }
          if (
            err?.response?.status === 409 &&
            err?.response?.status.data === 2
          ) {
            setBackErrors({
              ...backErrors,
              PhoneNumber: "This phone number is already used!",
            });
          } else if (
            err?.response?.status === 422 &&
            err?.response?.status.data === 2
          ) {
            setBackErrors({
              ...backErrors,
              PhoneNumber: "This is not a valid phone number format!",
            });
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
  };
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.Email) {
      errors.Email = "Email is required!";
    } else if (!regex.test(values.Email)) {
      errors.Email = "This is not a valid email format!";
    }
    //validate the company name
    if (!values.CompanyName) {
      errors.CompanyName = "Company name is required!";
    }
    //Validate the company responsable name
    if (!values.ResponsableName) {
      errors.ResponsableName =
        "The responsable for this comapany name is required!";
    }
    //Validate the phone number
    if (!values.Tel) {
      errors.Tel = "Phone number is required!";
    } else if (!values.Tel.match("[0-9]{10}")) {
      errors.Tel = "Please provide valid phone number!";
    }
    return errors;
  };
  //-----------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateUserModal}
      onHide={() => setShowUpdateUserModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowUpdateUserModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create this user</h5>
        <Form>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Company Name</Form.Label>
              <InputGroup id="email">
                <Form.Control
                  required
                  type="text"
                  name="CompanyName"
                  value={newUser?.CompanyName}
                  onChange={onChangeNewUser}
                  placeholder="Enter your company name"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.CompanyName && (
              <Alert variant="danger">{inputErrors.CompanyName}</Alert>
            )}
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup id="email">
                <Form.Control
                  required
                  type="text"
                  name="ResponsableName"
                  value={newUser?.ResponsableName}
                  onChange={onChangeNewUser}
                  placeholder="Enter your company name"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.ResponsableName && (
              <Alert variant="danger">{inputErrors.ResponsableName}</Alert>
            )}
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="Email"
                  value={newUser?.Email}
                  onChange={onChangeNewUser}
                  placeholder="Enter your company email"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.Email && (
              <Alert variant="danger">{inputErrors.Email}</Alert>
            )}
            {backErrors.Email && (
              <Alert variant="danger">{backErrors.Email}</Alert>
            )}
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="+XX-XXX XXX XXX"
                name="Tel"
                value={newUser?.Tel}
                onChange={onChangeNewUser}
              />
            </Form.Group>
            {inputErrors.Tel && (
              <Alert variant="danger">{inputErrors.Tel}</Alert>
            )}
            {backErrors.Tel && <Alert variant="danger">{backErrors.Tel}</Alert>}
          </Col>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* If u need to bring them to be justify between, swap the button position */}
        <Button
          variant="link"
          className="text-black ms-auto btn btn-danger"
          onClick={() => setShowUpdateUserModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="btn btn-success"
          type="submit"
          onClick={onSubmitNewUser}
        >
          {apiLoading ? (
            <Spinner animation="border" variant="dark" />
          ) : (
            "Create"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateUserModal;

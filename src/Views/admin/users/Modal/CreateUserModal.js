// ** react imports
import React from "react";
import { useState } from "react";
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
// **  Api config
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
import { FormFeedback } from "reactstrap";
//---------------------------------------------------------------------
function CreateUserModal({
  showCreateUserModal,
  setShowCreateUserModal,
  setShowCreateUserToast,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** initial state
  const initialeState = {
    Email: "",
    CompanyName: "",
    ResponsableName: "",
    Tel: "",
  };
  // ** states
  const [apiLoading, setApiLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({ ...initialeState });
  //-----------------------------------------------------------------
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
  }, [showCreateUserModal]); */
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
        const res = await axios.post(ApiLinks.Auth.signup, newUser);
        if (res?.status === 201) {
          onHide();
          refresh();
          setShowCreateUserToast();
        }
      } catch (err) {
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
  // ** on validate
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
  // ** on hide
  const onHide = () => {
    setShowCreateUserModal();
    setErrors({});
    setNewUser({ ...initialeState });
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateUserModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create Account</h5>
        <Form onSubmit={onSubmit}>
          <Col /* md={6} */ className="mb-3">
            <Form.Group className="mb-4">
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control
                  autoFocus
                  type="text"
                  name="CompanyName"
                  value={newUser.CompanyName}
                  onChange={onChange}
                  isInvalid={errors.CompanyName && true}
                  placeholder="company name ..."
                  required
                />
              </InputGroup>
              {errors.CompanyName && (
                <FormFeedback className="d-block">
                  {errors.CompanyName}
                </FormFeedback>
              )}
            </Form.Group>
          </Col>
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
          {/* <Col className="mb-3">
            <Form.Group>
              <Form.Label>Select an offer</Form.Label>
              <Form.Select
                name="offerId"
                value={newUser?.offerId}
                onChange={onChange}
              >
                <option defaultValue>Open this select menu</option>
                {offers.map((offer) => {
                  return (
                    <option key={offer.id} value={offer.id}>
                      {offer.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col> */}
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
                "Create"
              )}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateUserModal;

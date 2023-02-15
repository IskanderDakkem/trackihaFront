import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
} from "@themesberg/react-bootstrap";
//---------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
/* import { BASE_PATH } from "../../../../Context/Axios"; */
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------
function UpdateCompanyModal({
  showUpdateCompanyModal,
  setShowUpdateCompanyModal,
  setShowUpdateCompanyToast,
  SelectedCompany,
}) {
  const { setAuth } = useAuth();
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  //---------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------
  const [updateCompany, setUpdateCompany] = useState({});
  useEffect(() => {
    const getCompanies = async () => {
      await axios
        .get(ApiLinks.Company.getSpecificCompany + SelectedCompany, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setUpdateCompany({ ...res?.data?.item });
          }
        })
        .catch((err) => {
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
    if (SelectedCompany !== 0 && SelectedCompany !== undefined) {
      getCompanies();
    }
  }, [SelectedCompany]);
  //---------------------------------------------------------
  const onChangeUpdateCompany = (event) => {
    const { name, value } = event.target;
    setUpdateCompany({ ...updateCompany, [name]: value });
  };
  //---------------------------------------------------------
  const handleUpdateCompanySubmit = async (event) => {
    event.preventDefault();
    setInputErrors({});
    setBackErrors({});
    console.log(updateCompany);
    setInputErrors(validate(updateCompany));
    if (Object.keys(inputErrors).length === 0) {
      await axios
        .put(ApiLinks.Company.update + SelectedCompany, updateCompany, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setInputErrors({});
            setBackErrors({});
            setShowUpdateCompanyModal(false);
            setShowUpdateCompanyToast(true);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors({
              ...backErrors,
              ops: "Something went wrong",
            });
          } else if (err?.response?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          } else if (err?.response?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          } else if (err?.response?.status === 406) {
            setBackErrors({
              ...backErrors,
              required: "All informations are required!",
            });
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
  };
  const cancelModal = () => {
    setShowUpdateCompanyModal(false);
    setBackErrors({});
    setInputErrors({});
  };
  //Controlling the input
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (
      !values.CompanyName &&
      !values.CompanyResponsable &&
      !values.CompanyEmail &&
      !values.PhoneNumber
    ) {
      errors.required = "At least update on attribut!";
    }
    //Validate email
    if (values.CompanyEmail && !regex.test(values.CompanyEmail)) {
      errors.CompanyEmail = "This is not a valid email format!";
    }
    //validate phone number
    if (values.PhoneNumber && !values.PhoneNumber.match("[0-9]{10}")) {
      errors.PhoneNumber = "Phone number is required!";
    }
    return errors;
  };
  //---------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateCompanyModal}
      onHide={() => setShowUpdateCompanyModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowUpdateCompanyModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Update a company</h5>
        <Form>
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="CompanyName"
                  value={updateCompany?.CompanyName}
                  onChange={onChangeUpdateCompany}
                  placeholder={`New company name`}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="CompanyResponsable"
                  value={updateCompany?.CompanyResponsable}
                  onChange={onChangeUpdateCompany}
                  placeholder={`New company responsable name`}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="CompanyEmail"
                  value={updateCompany?.CompanyEmail}
                  onChange={onChangeUpdateCompany}
                  placeholder={`New company email`}
                />
              </InputGroup>
            </Form.Group>
            {inputErrors?.CompanyEmail && (
              <Alert variant="danger">{inputErrors?.CompanyEmail}</Alert>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                type="number"
                name="PhoneNumber"
                value={updateCompany?.PhoneNumber}
                onChange={onChangeUpdateCompany}
                placeholder={`New phone number`}
              />
            </Form.Group>
            {inputErrors?.PhoneNumber && (
              <Alert variant="danger">{inputErrors?.PhoneNumber}</Alert>
            )}
          </Col>
        </Form>
        {backErrors?.required && (
          <Alert variant="danger"> {backErrors?.required} </Alert>
        )}
        {backErrors?.ops && <Alert variant="danger"> {backErrors?.ops} </Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={cancelModal}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleUpdateCompanySubmit}
          className="btn btn-success"
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
//---------------------------------------------------------
export default UpdateCompanyModal;

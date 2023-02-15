//**React imports */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------
//**Bootstrap imports */
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
/* import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg"; */
//---------------------------------------------------------------------
//**Api config */
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------------------
function CreateCompanyModal({
  showCreateCompanyModal,
  setShowCreateCompanyModal,
  setShowCreateCompanyToast,
}) {
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //-----------------------------------------------------------------
  const [apiLoading, setApiLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //-----------------------------------------------------------------
  const [newCompany, setNewCompany] = useState({
    CompanyName: "",
    CompanyResponsable: "",
    CompanyEmail: "",
    PhoneNumber: "",
  });
  const onChangeNewCompany = (event) => {
    const { name, value } = event.target;
    setNewCompany({ ...newCompany, [name]: value });
  };
  //-----------------------------------------------------------------
  /* const [companyLogo, setCompanyLogo] = useState({
    preview: Profile3,
    raw: "",
  });
  const onChangeCompanyLogo = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setCompanyLogo({
        preview: URL.createObjectURL(files[0]),
        raw: files[0],
      });
    }
  }; */
  //-----------------------------------------------------------------
  const onSubmitNewCompany = async (event) => {
    event.preventDefault();
    setBackErrors({});
    setInputErrors({});
    setInputErrors(validate(newCompany));
    setApiLoading(true);
    if (Object.keys(inputErrors).length === 0) {
      /* let uploadApproved = false;
      let companyId = null; */
      await axios
        .post(ApiLinks.Company.create + Auth, newCompany, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          const { status } = res;
          if (status === 201) {
            setBackErrors({});
            setInputErrors({});
            setNewCompany({
              CompanyName: "",
              CompanyResponsable: "",
              CompanyEmail: "",
              PhoneNumber: "",
            });
            setShowCreateCompanyModal(false);
            setShowCreateCompanyToast(true);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors({ ...backErrors, ops: "Something went wrong" });
          } else if (err?.response?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          } else if (err?.response?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          } else if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          } else if (err?.response?.status === 406) {
            setBackErrors({
              ...backErrors,
              required: "All informations are required!",
            });
          } else if (
            err?.response?.status === 409 &&
            err?.response?.data.status === 1
          ) {
            setBackErrors({
              ...backErrors,
              CompanyEmail: "This email is already used!",
            });
          } else if (
            err?.response?.status === 422 &&
            err?.response?.data.status === 1
          ) {
            setBackErrors({
              ...backErrors,
              CompanyEmail: "This is not a valid email format!",
            });
          } else if (
            err?.response?.status === 409 &&
            err?.response?.data.status === 2
          ) {
            setBackErrors({
              ...backErrors,
              PhoneNumber: "This phone number is already used!",
            });
          } else if (
            err?.response?.status === 422 &&
            err?.response?.data.status === 2
          ) {
            setBackErrors({
              ...backErrors,
              PhoneNumber: "This is not a valid phone number format!",
            });
          } else if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });

      /* if (uploadApproved && companyId !== null && companyId !== undefined) {
        const formData = new FormData();
        console.log("###################: ", companyId);
        formData.append("file", companyLogo.raw);
        await axios
          .put(ApiLinks.Company.uploadCompanyLogo + companyId, formData, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          })
          .then((res) => {
            const { status } = res;
            if (status === 200) {
              setBackErrors({});
              setInputErrors({});
              setNewCompany({
                CompanyName: "",
                CompanyResponsable: "",
                CompanyEmail: "",
                PhoneNumber: "",
              });
              setShowCreateCompanyModal(false);
              setShowCreateCompanyToast(true);
            }
          })
          .catch((err) => {});
      } */
    }
    setApiLoading(false);
  };
  //input ontroller
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    //Validate company email
    if (!values.CompanyEmail) {
      errors.CompanyEmail = "Email is required!";
    } else if (!regex.test(values.CompanyEmail)) {
      errors.CompanyEmail = "This is not a valid email format!";
    }
    //validate the company name
    if (!values.CompanyName) {
      errors.CompanyName = "Company name is required!";
    }
    //Validate the company responsable name
    if (!values.CompanyResponsable) {
      errors.CompanyResponsable =
        "The responsable for this comapany name is required!";
    }
    //Validate the phone number
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Phone number is required!";
    } else if (!values.PhoneNumber.match("[0-9]{10}")) {
      errors.PhoneNumber = "Please provide valid phone number!";
    }
    return errors;
  };
  //-----------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateCompanyModal}
      onHide={() => setShowCreateCompanyModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowCreateCompanyModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create a company</h5>
        <Form onSubmit={onSubmitNewCompany}>
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Company Name</Form.Label>
              <InputGroup id="email">
                <Form.Control
                  required
                  type="text"
                  name="CompanyName"
                  value={newCompany?.CompanyName}
                  onChange={onChangeNewCompany}
                  placeholder="Enter your company name"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.CompanyName && (
              <Alert variant="danger">{inputErrors.CompanyName}</Alert>
            )}
          </Col>
          {/* <Col  className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Company Logo</Form.Label>
              <div className="d-xl-flex align-items-center">
                <div className="user-avatar xl-avatar">
                  <Image
                    fluid
                    rounded
                    src={companyLogo === null ? Profile3 : companyLogo.preview}
                  />
                </div>
                <div className="file-field">
                  <div className="d-flex justify-content-xl-center ms-xl-3">
                    <div className="d-flex">
                      <span className="icon icon-md">
                        <FontAwesomeIcon icon={faPaperclip} className="me-3" />
                      </span>
                      <input
                        type="file"
                        name="file"
                        onChange={onChangeCompanyLogo}
                      />
                      <div className="d-md-block text-start">
                        <div className="fw-normal text-dark mb-1">
                          Choose Icon
                        </div>
                        <div className="text-gray small">
                          PNG. Max size of 100K
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
          </Col> */}
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup id="email">
                <Form.Control
                  required
                  type="text"
                  name="CompanyResponsable"
                  value={newCompany?.CompanyResponsable}
                  onChange={onChangeNewCompany}
                  placeholder="Enter your the responsable name"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.CompanyResponsable && (
              <Alert variant="danger">{inputErrors.CompanyResponsable}</Alert>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="CompanyEmail"
                  value={newCompany?.CompanyEmail}
                  onChange={onChangeNewCompany}
                  placeholder="Enter your company email"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.CompanyEmail && (
              <Alert variant="danger">{inputErrors.CompanyEmail}</Alert>
            )}
            {backErrors.CompanyEmail && (
              <Alert variant="danger">{backErrors.CompanyEmail}</Alert>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group id="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="+XX-XXX XXX XXX"
                name="PhoneNumber"
                value={newCompany?.PhoneNumber}
                onChange={onChangeNewCompany}
              />
            </Form.Group>
            {inputErrors.PhoneNumber && (
              <Alert variant="danger">{inputErrors.PhoneNumber}</Alert>
            )}
            {backErrors.PhoneNumber && (
              <Alert variant="danger">{backErrors.PhoneNumber}</Alert>
            )}
          </Col>
        </Form>
        {backErrors.ops && <Alert variant="danger">{backErrors.ops}</Alert>}
        {backErrors.required && (
          <Alert variant="danger">{backErrors.required}</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowCreateCompanyModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="btn btn-success"
          type="submit"
          onClick={onSubmitNewCompany}
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
//-----------------------------------------------------------------
export default CreateCompanyModal;

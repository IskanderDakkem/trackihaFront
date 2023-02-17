// ** react imports
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
  Alert,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** API config
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import { BASE_PATH } from "../../../../Context/Axios";
// ** react select
import Select from "react-select";
//----------------------------------------------------------------------------
function CreateOrderModal({
  setShowCreateOrderModal,
  showCreateOrderModal,
  setShowCreateOrderToast,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  // ** states
  const [loadingApi, setLoadingApi] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const [steps, setSteps] = useState([]);
  const [Sequences, setSequences] = useState([]);
  const [sequencesOptions, setSequenesOptions] = useState([]);
  const [hubspotsList, setHubspotList] = useState([]);
  const [errors, setErrors] = useState({});
  const [trackingCode, setTrackingCode] = useState("");
  // ** fetching data
  useEffect(() => {
    if (
      showCreateOrderModal &&
      Auth !== 0 &&
      Auth !== null &&
      Auth !== undefined
    ) {
      getAllUserCompanies();
      getAllUserSteps();
      getAllUserSequence();
      /* getAllHubSports(); */
    }
  }, [showCreateOrderModal]);
  // ** functions
  const getAllUserCompanies = async () => {
    try {
      const res = await axios.get(ApiLinks.Company.getAllUserCompanies + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setCompanies((prev) => [...res?.data?.Companies]);
        const options = [];
        res.data.Companies.map((company) => {
          options.push({
            value: company.id,
            label: company.CompanyName,
          });
        });
        setCompaniesOptions(options);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllUserSteps = async () => {
    try {
      const res = await axios.get(ApiLinks.Steps.getAllUserSteps + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setSteps((prev) => [...res?.data?.Steps]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllUserSequence = async (req, res) => {
    try {
      const res = await axios.get(
        ApiLinks.Sequence.getAllUserSequences + Auth,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        setSequences((prev) => [...res?.data?.items]);
        const options = [];
        res.data.items.map((sequence) => {
          options.push({ value: sequence, label: sequence.name });
        });
        setSequenesOptions((prev) => options);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /* const getAllHubSports = async () => {
    try {
      const res = await axios.get(ApiLinks.deliveryCompany.getAll, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setHubspotList((prev) => [...res?.data?.items]);
      }
    } catch (error) {
      console.log(error);
    }
  }; */
  // ** Select the company and show its detailes
  const [selectedCompany, setSelectedCompany] = useState({ id: "" });
  const onChangeSelecteCompany = (option) => {
    const match = companies.find(
      (company) => parseInt(company.id) === parseInt(option.value)
    );
    setSelectedCompany((prev) => ({ ...match }));
  };
  // ** generate a timestamp

  const generateTruckingCode = (event) => {
    let code = Math.floor(Date.now() / 1000);
    code = "OZ" + new Date().getFullYear() + String(code);
    setTrackingCode(code);
  };
  // ** on change estimated delivery date
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);
  const onChangeEstimatedDeliveryDate = (event) => {
    const { value } = event.target;
    setEstimatedDeliveryDate((prev) => value);
  };
  // ** on change the selected sequence
  const [selectedSequence, setSeletedSequence] = useState({ id: "" });
  const [stepsDates, setStepsDates] = useState([]);
  const onChangeSelectedSequence = (option) => {
    const { value } = option;
    const matchSequence = Sequences.find(
      (sequence) => parseInt(sequence.id) === parseInt(value.id)
    );
    const sequenceSteps = matchSequence.steps.split("||");
    const selectedSteps = [];
    sequenceSteps.map((stepId) => {
      const match = steps.find(
        (step) => parseInt(step.id) === parseInt(stepId)
      );
      selectedSteps.push({ id: match.id, value: match, Date: null });
    });
    setStepsDates((prev) => [...selectedSteps]);
    setSeletedSequence((prev) => ({
      id: value.id,
    }));
  };
  // ** on change steps dates
  const onChangeSelectSequenceStepDate = (event) => {
    const index = event.target.name;
    const Date = event.target.value;
    const newStepsDates = stepsDates;
    newStepsDates[index] = {
      id: newStepsDates[index].id,
      Date,
      value: newStepsDates[index].value,
    };
    setStepsDates((prev) => [...newStepsDates]);
  };
  // ** parternss informations
  const [deliveryDetailes, setDeliveryDetailes] = useState({
    IDhubspot: "",
    hubspotId: "",
    IDcrm: "",
    crmId: "",
    description: "",
  });
  const onChangeDeliveryCompanyDetailes = (event) => {
    const { name, value } = event.target;
    setDeliveryDetailes((prev) => ({ ...prev, [name]: value }));
  };
  // ** send email
  const [sendMail, setSendMail] = useState(false);
  const onChangeSendMail = (event) => {
    setSendMail(!sendMail);
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const newOrder = {
      companyId: selectedCompany.id,
      trackingCode,
      estimatedDeliveryDate,
      crmLink: deliveryDetailes.IDcrm,
      crmId: deliveryDetailes.crmId,
      deliveryCompanyLink: deliveryDetailes.IDhubspot,
      deliveryCompanyId: deliveryDetailes.hubspotId,
      description: deliveryDetailes.description,
      sequenceId: selectedSequence.id,
      stepsDates,
      sendMail,
    };
    setLoadingApi(true);
    const frontErrors = validate(newOrder);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.post(ApiLinks.Orders.Create + Auth, newOrder, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (res?.status === 201) {
          onHide();
          refresh();
          setShowCreateOrderToast(true);
        }
      } catch (err) {
        // ** bad request
        if (err?.response?.status === 400) {
          setErrors({ ops: "Something went wrong" });
        }
        // ** no token
        else if (err?.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** expired token
        else if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** server error
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setLoadingApi(false);
  };
  // ** on hide
  const validate = (value) => {
    const errors = {};
    if (value.companyId.length === 0) {
      errors.companyId = "Select a company!";
    }
    if (value.trackingCode.length === 0) {
      errors.trackingCode = "Generate a tracking code!";
    }
    if (!value.estimatedDeliveryDate) {
      errors.estimatedDeliveryDate = "Select a estimate delivery date!";
    }
    if (value.sequenceId.length === 0) {
      errors.sequenceId = "Select a sequence!";
    } else if (value.stepsDates.length === 0) {
      errors.stepsDates = "Select a date for each step!";
    }
    return errors;
  };
  // ** on close
  const onHide = () => {
    setShowCreateOrderModal(false);
    setSendMail(false);
    setSeletedSequence({ id: "" });
    setEstimatedDeliveryDate("");
    setStepsDates([]);
    setTrackingCode("");
    setSelectedCompany({ id: "" });
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateOrderModal}
      onHide={onHide}
      className="w-100"
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create an order</h5>
        <Form onSubmit={onSubmit}>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Select a company</Form.Label>
              <Select
                required
                options={companiesOptions}
                onChange={onChangeSelecteCompany}
              />
            </Form.Group>
          </Col>
          {errors.companyId && (
            <FormFeedback className="d-block">{errors.companyId}</FormFeedback>
          )}
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Generate a tracking code</Form.Label>
              <div className="d-flex">
                <Button
                  className="btn btn-primary me-2"
                  onClick={generateTruckingCode}
                >
                  Generate
                </Button>
                <Form.Control
                  value={trackingCode}
                  disabled={true}
                  placeholder="Tracking Code"
                />
              </div>
            </Form.Group>
            {errors.trackingCode && (
              <FormFeedback className="d-block">
                {errors.trackingCode}
              </FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="CompanyName"
                  value={selectedCompany?.CompanyName}
                  disabled={true}
                  placeholder="Company Name"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Responsable name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="CompanyResponsable"
                  value={selectedCompany?.CompanyResponsable}
                  disabled={true}
                  placeholder="Responsable Name"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="CompanyEmail"
                  value={selectedCompany?.CompanyEmail}
                  disabled={true}
                  placeholder="Company email"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company phone number</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="PhoneNumber"
                  value={selectedCompany?.PhoneNumber}
                  disabled={true}
                  placeholder="Company phone number"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Estimate delivery date</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="date"
                  value={estimatedDeliveryDate}
                  name="estimatedDeliveryDate"
                  onChange={onChangeEstimatedDeliveryDate}
                  isInvalid={errors.estimatedDeliveryDate && true}
                  placeholder="Estimated delivery date"
                />
              </InputGroup>
            </Form.Group>
            {errors.estimatedDeliveryDate && (
              <FormFeedback className="d-block">
                {errors.estimatedDeliveryDate}
              </FormFeedback>
            )}
          </Col>
          {/* Select a sequence */}
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Select a sequence</Form.Label>
              <Select
                options={sequencesOptions}
                required
                onChange={onChangeSelectedSequence}
              />
            </Form.Group>
            {errors.sequenceId && (
              <FormFeedback className="d-block">
                {errors.sequenceId}
              </FormFeedback>
            )}
          </Col>
          {/* Steps dates */}
          <Col className="mb-3">
            <Form.Group className="d-flex justify-content-around flex-column">
              {stepsDates.map((step) => {
                return (
                  <div
                    key={step.id}
                    className="d-flex flex-column align-items-center pt-3 mb-1"
                  >
                    <Form.Label>{step.value.label}</Form.Label>
                    <img
                      src={BASE_PATH + step.value.icone}
                      className="py-2"
                      alt="#"
                      style={{ width: "50px" }}
                    />
                    <InputGroup>
                      <Form.Control
                        type="Date"
                        name={stepsDates.indexOf(step)}
                        onChange={onChangeSelectSequenceStepDate}
                        placeholder="Estimated delivery date"
                      />
                    </InputGroup>
                  </div>
                );
              })}
            </Form.Group>
            {errors.stepsDates && (
              <FormFeedback className="d-block">
                {errors.stepsDates}
              </FormFeedback>
            )}
          </Col>
          {/* select crm */}
          {/* <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>CRM ID</Form.Label>
              <div className="d-flex gap-3">
                <Form.Control
                  type="text"
                  placeholder="CRM ID"
                  name="IDcrm"
                  value={deliveryDetailes?.IDcrm}
                  onChange={onChangeDeliveryCompanyDetailes}
                />
              </div>
            </Form.Group>
          </Col> */}
          {/* select hubspot ud */}
          {/*  <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Logistics ID</Form.Label>
              <div className="d-flex gap-3">
                <Form.Control
                  type="text"
                  placeholder="Logistics ID"
                  name="IDhubspot"
                  value={deliveryDetailes?.IDhubspot}
                  onChange={onChangeDeliveryCompanyDetailes}
                />
                <Form.Select
                  onChange={onChangeDeliveryCompanyDetailes}
                  name="hubspotId"
                >
                  <option defaultValue>Select Logistics</option>
                  {hubspotsList.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col> */}
          {/* Select description */}
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <textarea
                className="form-control border"
                rows="3"
                name="description"
                onChange={onChangeDeliveryCompanyDetailes}
                value={deliveryDetailes.description}
              ></textarea>
            </Form.Group>
          </Col>
          {/* Send follow up email */}
          <Col className="mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="sendMail"
              onChange={onChangeSendMail}
            />
            <label className="form-check-label">send follow-up email</label>
          </Col>
          {errors.ops && <Alert variant="danger">{errors.ops}</Alert>}
          {errors.alreadyused && (
            <p className="text-center text-danger">
              This company is already used by an order, Please delete the order
              first
            </p>
          )}
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
              type="submit"
              className="btn btn-success"
            >
              {loadingApi ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
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

export default CreateOrderModal;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//----------------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "@themesberg/react-bootstrap";
import Select from "react-select";
//----------------------------------------------------------------------------
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import { BASE_PATH } from "../../../../Context/Axios";
//----------------------------------------------------------------------------
function CreateOrderModal({
  setShowCreateOrderModal,
  showCreateOrderModal,
  setShowCreateOrderToast,
}) {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [loadingApi, setLoadingApi] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //--------------------------------------------------------------
  //Get all the user companies
  const [companies, setCompanies] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const getAllUserCompanies = async () => {
    await axios
      .get(ApiLinks.Company.getAllUserCompanies + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.Companies !== undefined) {
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
        }
      })
      .catch((err) => {});
  };
  //--------------------------------------------------------------
  //get all the user steps
  const [steps, setSteps] = useState([]);
  const getAllUserSteps = async () => {
    await axios
      .get(ApiLinks.Steps.getAllUserSteps + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setSteps((prev) => [...res?.data?.Steps]);
        }
      })
      .catch((err) => {});
  };
  //--------------------------------------------------------------
  //get the user sequences
  const [Sequences, setSequences] = useState([]);
  const [sequencesOptions, setSequenesOptions] = useState([]);
  const getAllUserSequence = async (req, res) => {
    await axios
      .get(ApiLinks.Sequence.getAllUserSequences + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setSequences((prev) => [...res?.data?.items]);
          const options = [];
          res.data.items.map((sequence) => {
            options.push({ value: sequence, label: sequence.name });
          });
          setSequenesOptions((prev) => options);
        }
      })
      .catch((err) => {});
  };
  //--------------------------------------------------------------
  //get all delivery companies
  const [hubspotsList, setHubspotList] = useState([]);
  const getAllHubSports = async () => {
    await axios
      .get(ApiLinks.deliveryCompany.getAll, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setHubspotList((prev) => [...res?.data?.items]);
        }
      })
      .catch((err) => {});
  };
  //--------------------------------------------------------------
  //Get all crm
  const [crmList, setCrmList] = useState([]);
  /* const getAllCrm = async () => {
    await axios
      .get(ApiLinks.Crm.getAll, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setCrmList((prev) => [...res?.data?.items]);
        }
      })
      .catch((err) => {
        console.log("get all crm: ", err);
      });
  }; */
  //--------------------------------------------------------------
  //Bring data
  useEffect(() => {
    if (Auth !== 0 && Auth !== null && Auth !== undefined) {
      getAllUserCompanies();
      getAllUserSteps();
      getAllUserSequence();
      getAllHubSports();
      /* getAllCrm(); */
    }
  }, [showCreateOrderModal]);
  //--------------------------------------------------------------
  //Select the company and show its detailes
  const [selectedCompany, setSelectedCompany] = useState({ id: "" });
  const onChangeSelecteCompany = (option) => {
    const match = companies.find(
      (company) => parseInt(company.id) === parseInt(option.value)
    );
    setSelectedCompany((prev) => ({ ...match }));
  };
  //--------------------------------------------------------------
  //generate a timestamp
  const [trackingCode, setTrackingCode] = useState("");
  const generateTruckingCode = (event) => {
    let code = Math.floor(Date.now() / 1000);
    code = "OZ" + new Date().getFullYear() + String(code);
    setTrackingCode(code);
  };
  //--------------------------------------------------------------
  //on change estimated delivery date
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);
  const onChangeEstimatedDeliveryDate = (event) => {
    const { value } = event.target;
    setEstimatedDeliveryDate((prev) => value);
  };
  //--------------------------------------------------------------
  //on change the selected sequence
  const [selectedSequence, setSeletedSequence] = useState({ id: "" });
  const [stepsDates, setStepsDates] = useState([]);
  /* const [sentStepsDates, setSentStepsDates] = useState([]); */
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
    /* setSentStepsDates((prev) => [...selectedSentStepsDates]); */
    setSeletedSequence((prev) => ({
      id: value.id,
    }));
  };
  //--------------------------------------------------------------
  //on change steps dates
  const onChangeSelectSequenceStepDate = (event) => {
    const index = event.target.name;
    const Date = event.target.value;
    /* const newStepsDatesSent = sentStepsDates; */
    const newStepsDates = stepsDates;
    newStepsDates[index] = {
      id: newStepsDates[index].id,
      Date,
      value: newStepsDates[index].value,
    };
    setStepsDates((prev) => [...newStepsDates]);
  };
  //--------------------------------------------------------------
  //parternss informations
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
  //--------------------------------------------------------------
  //send email
  const [sendMail, setSendMail] = useState(false);
  const onChangeSendMail = (event) => {
    setSendMail(!sendMail);
  };
  //--------------------------------------------------------------
  //Create an error
  const handelSubmitCreateOrder = async (event) => {
    event.preventDefault();
    setInputErrors({});
    setBackErrors({});
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
    setInputErrors(validate(newOrder));
    setLoadingApi(true);
    if (Object.keys(inputErrors).length === 0) {
      await axios
        .post(ApiLinks.Orders.Create + Auth, newOrder, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 201) {
            setShowCreateOrderModal(false);
            setShowCreateOrderToast(true);
            setSendMail(false);
            setSeletedSequence({ id: "" });
            setEstimatedDeliveryDate("");
            setStepsDates([]);
            setTrackingCode("");
            setSelectedCompany({ id: "" });
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors({ ...backErrors, ops: "Something went wrong" });
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
          if (err?.response?.status === 406) {
            setBackErrors((prev) => ({
              ...prev,
              required: "All informations are required!",
            }));
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
    setLoadingApi(false);
  };
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
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateOrderModal}
      onHide={() => setShowCreateOrderModal(false)}
      className="w-100"
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowCreateOrderModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create an order</h5>
        <Form>
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Select a company</Form.Label>
              <Select
                required
                options={companiesOptions}
                /* value={selectedCompany.id} */
                onChange={onChangeSelecteCompany}
              />
            </Form.Group>
          </Col>
          {inputErrors.companyId && (
            <Alert variant="danger">{inputErrors.companyId}</Alert>
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
            {inputErrors.trackingCode && (
              <Alert variant="danger">{inputErrors.trackingCode}</Alert>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
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
                  required
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
                  required
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
                  required
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
                  placeholder="Estimated delivery date"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.estimatedDeliveryDate && (
              <Alert variant="danger">
                {inputErrors.estimatedDeliveryDate}
              </Alert>
            )}
          </Col>
          {/* Select a sequence */}
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Select a sequence</Form.Label>
              <Select
                options={sequencesOptions}
                required
                /* value={selectedSequence.id} */
                onChange={onChangeSelectedSequence}
              />
            </Form.Group>
            {inputErrors.sequenceId && (
              <Alert variant="danger">{inputErrors.sequenceId}</Alert>
            )}
          </Col>
          {/* Steps dates */}
          <Col className="mb-3">
            <Form.Group className="d-flex justify-content-around flex-column">
              {stepsDates.map((step) => {
                return (
                  <div
                    key={step.id}
                    className="d-flex flex-column align-items-center pt-3"
                  >
                    <Form.Label>{step.value.label}</Form.Label>
                    <img
                      src={BASE_PATH + step.value.icone}
                      alt="#"
                      style={{ width: "50px" }}
                    />
                    <InputGroup>
                      <Form.Control
                        required
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
            {inputErrors.stepsDates && (
              <Alert variant="danger">{inputErrors.stepsDates}</Alert>
            )}
          </Col>
          {/* select crm */}
          <Col className="mb-3">
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
                {/* <Form.Select
                  onChange={onChangeDeliveryCompanyDetailes}
                  name="crmId"
                  className=""
                >
                  <option defaultValue>Select CRM</option>
                  {crmList.map((crm) => (
                    <option key={crm.id} value={crm.id}>
                      {crm.label}
                    </option>
                  ))}
                </Form.Select> */}
              </div>
            </Form.Group>
          </Col>
          {/* select hubspot ud */}
          <Col className="mb-3">
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
                  /* value={deliveryDetailes?.hubspotId} */
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
          </Col>
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
                required
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
          {backErrors.ops && <Alert variant="danger">{backErrors.ops}</Alert>}
          {backErrors.required && (
            <Alert variant="danger">{backErrors.required}</Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowCreateOrderModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handelSubmitCreateOrder}
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
      </Modal.Footer>
    </Modal>
  );
}

export default CreateOrderModal;

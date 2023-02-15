import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//----------------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import { BASE_PATH } from "../../../../Context/Axios";
//----------------------------------------------------------------------------
function UpdateOrderModal({
  setShowUpdateOrderModal,
  showUpdateOrderModal,
  setShowUpdateOrderToast,
  selectedOrder,
}) {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [loadingApi, setLoadingApi] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
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
          setHubspotList((prev) => res?.data?.items);
        }
      })
      .catch((err) => {
        /* if (err?.response?.status === 400) {
          setBackErrors({ ...backErrors, ops: "Something went wrong" });
        } */
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
  //--------------------------------------------------------------
  //Get all crm
  const [crmList, setCrmList] = useState([]);
  const getAllCrm = async () => {
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
        /* if (err?.response?.status === 400) {
          setBackErrors({ ...backErrors, ops: "Something went wrong" });
        } */
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
  //--------------------------------------------------------------
  const [updatedOrder, setUpdatedOrder] = useState({});
  const [selectedCompany, setSelectedCompany] = useState({});
  const [orderSequence, setOrderSeuqnce] = useState({});
  const [stepsDates, setStepsDates] = useState([]);
  const [displaydeSteps, setDisplayedSteps] = useState([]);
  const getOrder = async () => {
    await axios
      .get(ApiLinks.Orders.getOne + selectedOrder, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          setUpdatedOrder((prev) => ({ ...data?.Order }));
          setSelectedCompany((prev) => ({ ...data?.Company }));
          setOrderSeuqnce((prev) => ({ ...data?.Sequence }));
          setStepsDates((prev) => [...data?.stepsDate]);
          setDisplayedSteps((prev) => [...data?.Steps]);
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
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  //--------------------------------------------------------------
  useEffect(() => {
    if (
      selectedOrder !== 0 &&
      selectedOrder !== null &&
      selectedOrder !== undefined
    ) {
      getOrder();
      getAllCrm();
      getAllHubSports();
    }
  }, [selectedOrder, showUpdateOrderModal]);
  //--------------------------------------------------------------
  const onChangeDeliveryCompanyDetailes = (event) => {
    const { name, value } = event.target;
    setUpdatedOrder((prev) => ({ ...prev, [name]: value }));
  };
  const onChangeSelectSequenceStepDate = (event) => {
    const { name, value } = event.target;
    const updateStepsDates = stepsDates;
    updateStepsDates[name].Date = value;
    setStepsDates((prev) => updateStepsDates);
    setUpdatedOrder((prev) => ({ ...prev, stepsDates }));
  };
  //--------------------------------------------------------------
  const handleUpdateOrder = async (event) => {
    event.preventDefault();
    setLoadingApi(true);
    await axios
      .put(ApiLinks.Orders.Update + selectedOrder, updatedOrder, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setShowUpdateOrderModal(false);
          setShowUpdateOrderToast(true);
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
    setLoadingApi(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateOrderModal}
      onHide={() => setShowUpdateOrderModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowUpdateOrderModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Update an order</h5>
        <Form>
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Tracking code</Form.Label>
              <Form.Control
                type="text"
                value={updatedOrder?.trackingCode}
                disabled={true}
                placeholder="Tracking Code"
                name="trackingCode"
              />
            </Form.Group>
            {inputErrors.trackingCode && (
              <Alert variant="danger">{inputErrors.trackingCode}</Alert>
            )}
          </Col>
          <Col /* md={6} */ className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup id="email">
                <Form.Control
                  required
                  type="text"
                  name="CompanyResponsable"
                  value={selectedCompany?.CompanyResponsable}
                  disabled={true}
                  placeholder="Enter your the responsable name"
                />
              </InputGroup>
            </Form.Group>
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
                  value={updatedOrder?.estimatedDeliveryDate}
                  name="estimatedDeliveryDate"
                  placeholder={updatedOrder.estimatedDeliveryDate}
                  onChange={onChangeDeliveryCompanyDetailes}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Sequence</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  value={orderSequence?.name}
                  disabled={true}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          {displaydeSteps.map((step) => {
            return;
          })}
          <Col className="mb-3">
            <Form.Group className="d-flex justify-content-around flex-column">
              {displaydeSteps.map((step, index) => {
                return (
                  <div
                    key={step.id}
                    className="d-flex flex-column align-items-center pt-3"
                  >
                    <Form.Label>{step.label}</Form.Label>
                    <img
                      className="mb-1"
                      src={BASE_PATH + step.icone}
                      alt="#"
                      style={{ width: "50px" }}
                    />
                    <span className="text-info mb-2">
                      {stepsDates[displaydeSteps.indexOf(step)].Date !== null
                        ? new Date(
                            stepsDates[displaydeSteps.indexOf(step)].Date
                          ).toDateString()
                        : "Not defined yet"}
                    </span>
                    <InputGroup>
                      <Form.Control
                        required
                        type={
                          stepsDates[displaydeSteps.indexOf(step)].Date !== null
                            ? "date"
                            : "date"
                        }
                        name={displaydeSteps.indexOf(step)}
                        value={
                          stepsDates[/* displaydeSteps.indexOf(step) */ index]
                            .Date
                          /* stepsDates[displaydeSteps.indexOf(step)].Date !== null
                            ? new Date(
                                
                              ).toDateString()
                            : null */
                        }
                        /* disabled={
                          stepsDates[displaydeSteps.indexOf(step)].Date !== null
                            ? true
                            : false
                        } */
                        onChange={onChangeSelectSequenceStepDate}
                        /* placeholder="Estimated delivery date" */
                      />
                    </InputGroup>
                  </div>
                );
              })}
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>Hubspot ID</Form.Label>
              <div className="d-flex gap-5">
                <Form.Control
                  type="text"
                  placeholder="Hubspot ID..."
                  name="deliveryCompanyLink"
                  value={updatedOrder?.deliveryCompanyLink}
                  onChange={onChangeDeliveryCompanyDetailes}
                />
                <Form.Select
                  name="deliveryCompanyId"
                  value={updatedOrder?.deliveryCompanyId}
                  onChange={onChangeDeliveryCompanyDetailes}
                >
                  <option defaultValue>Select Hubspot</option>
                  {hubspotsList.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
          <Col ol className="mb-3">
            <Form.Group id="firstName">
              <Form.Label>CRM ID</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="CRM ID..."
                  name="crmLink"
                  value={updatedOrder?.crmLink}
                  onChange={onChangeDeliveryCompanyDetailes}
                />
                {/* <Form.Select
                  name="crmId"
                  value={updatedOrder?.crmId}
                  onChange={onChangeDeliveryCompanyDetailes}
                >
                  <option defaultValue>Select crm</option>
                  {crmList.map((crm) => (
                    <option key={crm.id} value={crm.id}>
                      {crm.label}
                    </option>
                  ))}
                </Form.Select> */}
              </div>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <textarea
                className="form-control border"
                rows="3"
                /* disabled={true} */
                name="description"
                value={updatedOrder?.description}
                onChange={onChangeDeliveryCompanyDetailes}
                required
              ></textarea>
            </Form.Group>
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
          onClick={() => setShowUpdateOrderModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleUpdateOrder}
          className="btn btn-success"
        >
          {loadingApi ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateOrderModal;

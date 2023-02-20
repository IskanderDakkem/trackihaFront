// ** react imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import {
  Col,
  Modal,
  Button,
  InputGroup,
  Alert,
  Form,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** api config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
//----------------------------------------------------------------------------
function DeliverOrderModal({
  setSendIsDeliveredToast,
  sendIsDeliveredModal,
  setSendIsDeliveredModal,
  selectedOrder,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** initial state
  const intialDelivery = {
    deliveryDate: "",
    selectedStep: "",
  };
  // ** states
  const [apiLoading, setApiLoading] = useState(false);
  const [sequenceSteps, setSequenceSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState({
    ...intialDelivery,
  });
  // ** fetching data
  useEffect(() => {
    if (
      sendIsDeliveredModal &&
      selectedOrder !== 0 &&
      selectedOrder !== null &&
      selectedOrder !== undefined
    ) {
      getOrderSteps();
    }
  }, [sendIsDeliveredModal]);
  // ** functions
  const getOrderSteps = async () => {
    await axios
      .get(ApiLinks.Sequence.getOrderSequenceSteps + selectedOrder.sequenceId, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setSequenceSteps((prev) => res?.data?.items);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };

  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiLoading(true);
    const frontErrors = validate(delivery);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.put(
          ApiLinks.Orders.sendIsDeliveredEmail + selectedOrder.orderId,
          delivery,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 200) {
          onHide();
          refresh();
          setSendIsDeliveredToast(true);
        }
      } catch (err) {
        // ** failed to update
        if (err?.response?.status === 400) {
          setErrors((prev) => ({
            ops: "Ops! Something is missing, Please refresh the page",
          }));
        }
        // ** no token
        else if (err?.response?.status === 401) {
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** token expired
        else if (err?.response?.status === 403) {
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** order not found
        else if (err?.response?.status === 404) {
          setErrors((prev) => ({
            ops: "Ops! Something is missing, Please refresh the page",
          }));
        }
        // ** delivery date is not valid
        else if (err?.response?.status === 409) {
          setErrors((prev) => ({
            deliveryDate: "This date should be after the delivery date",
          }));
        }
        // ** server error
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
    if (values.deliveryDate.length === 0) {
      errors.deliveryDate = "Delivery date is required!";
    }
    if (values.selectedStep.length === 0) {
      errors.selectedStep = "Please select a step!";
    }
    return errors;
  };
  // ** on close
  const onHide = () => {
    setSendIsDeliveredModal(false);
    setDelivery({ ...intialDelivery });
    setErrors({});
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={sendIsDeliveredModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <h5 className="mb-4 text-capitalize">
            Set this order to be delivered ?
          </h5>
          <p>The company will receive an email that this order we delivered</p>

          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Select the delivery day</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="deliveryDate"
                  onChange={onChange}
                  isInvalid={errors.deliveryDate && true}
                  required
                  autoFocus
                />
              </InputGroup>
            </Form.Group>
            {errors.deliveryDate && (
              <FormFeedback className="d-block">
                {errors.deliveryDate}
              </FormFeedback>
            )}
          </Col>

          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Select the delivery day</Form.Label>
              <Form.Select
                name="selectedStep"
                onChange={onChange}
                value={delivery?.selectedStep}
                required
              >
                <option>Open this select menu</option>
                {sequenceSteps.map((step) => {
                  return (
                    <option key={step.id} value={step.id}>
                      {step.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            {errors.selectedStep && (
              <FormFeedback className="d-block">
                {errors.selectedStep}
              </FormFeedback>
            )}
          </Col>
          {errors.ops && (
            <Alert variant="danger" className="my-2">
              {errors.ops}
            </Alert>
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

export default DeliverOrderModal;

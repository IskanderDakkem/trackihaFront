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
} from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
/* import { BASE_PATH } from "../../../../Context/Axios"; */
//----------------------------------------------------------------------------
function DeliverOrderModal({
  setSendIsDeliveredToast,
  sendIsDeliveredModal,
  setSendIsDeliveredModal,
  selectedOrder,
}) {
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //---------------------------------------------------------------------
  const [inputErrors, setInputErrors] = useState("");
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------
  const [sequenceSteps, setSequenceSteps] = useState([]);
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
  useEffect(() => {
    if (
      selectedOrder !== 0 &&
      selectedOrder !== null &&
      selectedOrder !== undefined
    ) {
      getOrderSteps();
    }
  }, [sendIsDeliveredModal, selectedOrder]);

  //---------------------------------------------------------------------
  const [delivery, setDelivery] = useState({
    deliveryDate: "",
    selectedStep: "",
  });
  const onChangeDelivery = (event) => {
    const { name, value } = event.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
  };
  //---------------------------------------------------------------------
  const handleDeliverOrder = async (event) => {
    event.preventDefault();
    setInputErrors({});
    setInputErrors(validate(delivery));
    if (Object.keys.length > 0) {
      await axios
        .put(
          ApiLinks.Orders.sendIsDeliveredEmail + selectedOrder.orderId,
          delivery,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200) {
            setSendIsDeliveredModal(false);
            setSendIsDeliveredToast(true);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors((prev) => ({ ...prev, ops: "Something went wrong" }));
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
            setBackErrors((prev) => ({
              ...prev,
              required: "All informations are required!",
            }));
          } else if (err?.response?.status === 409) {
            setBackErrors((prev) => ({
              ...prev,
              failure: "Invalide delivery date",
            }));
          } else if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
  };
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
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={sendIsDeliveredModal}
      onHide={() => setSendIsDeliveredModal(false)}
    >
      <form>
        <Modal.Header>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setSendIsDeliveredModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-4 text-capitalize">
            Set this order to be delivered ?
          </h5>
          <p>The company will receive an email that this order we delivered</p>

          <Col>
            <Form.Group>
              <Form.Label>Select the delivery day</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="deliveryDate"
                  onChange={onChangeDelivery}
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>
          {inputErrors.deliveryDate && (
            <Alert variant="danger">{inputErrors.deliveryDate}</Alert>
          )}
          <Col className="mt-1">
            <Form.Group>
              <Form.Label>Select the delivery day</Form.Label>
              <Form.Select
                name="selectedStep"
                onChange={onChangeDelivery}
                value={delivery?.selectedStep}
                required
              >
                <option defaultValue>Open this select menu</option>
                {sequenceSteps.map((step) => {
                  return (
                    <option key={step.id} value={step.id}>
                      {step.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          {inputErrors.selectedStep && (
            <Alert variant="danger">{inputErrors.selectedStep}</Alert>
          )}
          {backErrors.ops && <Alert variant="danger">{backErrors.ops}</Alert>}
          {backErrors.required && (
            <Alert variant="danger">{backErrors.required}</Alert>
          )}
          {backErrors.failure && (
            <Alert variant="danger">{backErrors.failure}</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="text-white ms-auto btn btn-danger"
            onClick={() => setSendIsDeliveredModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit  "
            variant="secondary"
            onClick={handleDeliverOrder}
            className="btn btn-success"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default DeliverOrderModal;

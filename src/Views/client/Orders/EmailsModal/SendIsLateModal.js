// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
// ** API config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
//--------------------------------------------------------------
function SendIsLateModal({
  sendIsLateModal,
  setSendIsLateModal,
  setSendIsLateEmailToast,
  selectedOrder,
  refresh,
}) {
  // ** router
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  // ** states
  const [errors, setErrors] = useState({});
  const [apiLoading, setApiLoading] = useState(false);
  // ** on submit
  const onSubmit = async () => {
    setApiLoading(true);
    try {
      const res = await axios.put(
        ApiLinks.Orders.sendIsLateEmail + selectedOrder,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        onHide();
        refresh();
        setSendIsLateEmailToast(true);
      }
    } catch (err) {
      // ** something is missing
      if (err?.response?.status === 400) {
        setErrors({
          failed:
            "Ops! can't delete something is missing, Please refresh the page",
        });
      }
      // ** no token
      else if (err?.response?.status === 401) {
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // **  token expired
      else if (err?.response?.status === 403) {
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** already used
      else if (err?.response?.status === 409) {
        setErrors({
          alreadyused: true,
        });
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
    setApiLoading(false);
  };
  // ** on close modal
  const onHide = () => {
    setSendIsLateModal(false);
    setErrors({});
    setApiLoading(false);
  };
  // ** ==>
  return (
    <Modal as={Modal.Dialog} centered show={sendIsLateModal} onHide={onHide}>
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-4 text-capitalize">Confirm this order is late ?</h5>
          <p className="text-capitalize">
            An email will be sent to the company that this's order will be late
          </p>
          {errors.failed && (
            <p className="text-center text-danger">{errors.failed}</p>
          )}
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
            onClick={onSubmit}
            className="btn btn-success"
          >
            {apiLoading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              "Confirm"
            )}
          </Button>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

export default SendIsLateModal;

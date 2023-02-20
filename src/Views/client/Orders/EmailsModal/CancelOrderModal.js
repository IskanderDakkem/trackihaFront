// ** React imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
// ** API config
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "./../../../../Context/routes";
//----------------------------------------------------------------------------
function CancelOrderModal({
  setCancelOrderToast,
  setCancelOrderModal,
  cancelOrder,
  selectedOrder,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [errors, setErrors] = useState({});
  // ** on submit
  const onSubmit = async () => {
    setLoadingButton(true);
    setErrors({});
    try {
      const res = await axios.put(
        ApiLinks.Orders.Cancel + selectedOrder,
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
        setCancelOrderToast(true);
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
      else if (err?.response?.status === 404) {
        setErrors({
          failed:
            "Ops! can't delete something is missing, Please refresh the page",
        });
      }
      // ** server error
      else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
    setLoadingButton(false);
  };
  // ** on close
  const onHide = () => {
    setCancelOrderModal(false);
    setErrors({});
  };
  // ** ==>
  return (
    <Modal as={Modal.Dialog} centered show={cancelOrder} onHide={onHide}>
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-4 text-capitalize">
            Are you sure u would like to cancel this order ? (this action cant
            be revert back later)
          </h5>
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
            {loadingButton ? (
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

export default CancelOrderModal;

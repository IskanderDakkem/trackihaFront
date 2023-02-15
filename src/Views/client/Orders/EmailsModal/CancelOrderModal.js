import React from "react";
import { useHistory } from "react-router-dom";
//----------------------------------------------------------------------------
import { Modal, Button } from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
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
}) {
  const Token = localStorage.getItem("Token");
  const { setAuth } = useAuth();
  const navigate = useHistory();
  const handleCancelOrder = async () => {
    await axios
      .put(
        ApiLinks.Orders.Cancel + selectedOrder,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200) {
          setCancelOrderModal(false);
          setCancelOrderToast(true);
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
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={cancelOrder}
      onHide={() => setCancelOrderModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setCancelOrderModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4 text-capitalize">Confirm canceling this order ?</h5>
        <p className="text-capitalize">
          An email will be sent to the company that the order has been canceled.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setCancelOrderModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleCancelOrder}
          className="btn btn-success"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CancelOrderModal;

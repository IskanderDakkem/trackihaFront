import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//----------------------------------------------------------------------------
import {
  /*   Row,
  Col,
  Card, */
  Modal,
  Button,
  /*  Container,
  Form,
  InputGroup, */
} from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Alert } from "bootstrap";
import { Routes } from "../../../../Context/routes";
/* import { BASE_PATH } from "../../../../Context/Axios"; */
//----------------------------------------------------------------------------
function DeleteOrderModal({
  setShowDeleteOrderModal,
  showDeleteOrderModal,
  setShowDeleteOrderToast,
  selectedOrder,
  refresh,
}) {
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //---------------------------------------------------------------------
  const [backErrors, setBackErrors] = useState("");
  //---------------------------------------------------------------------
  const deleteOrder = async () => {
    await axios
      .delete(ApiLinks.Orders.Delete + selectedOrder, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          refresh();
          setShowDeleteOrderToast(true);

          setShowDeleteOrderModal(false);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setBackErrors("Something went wrong");
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
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteOrderModal}
      onHide={() => setShowDeleteOrderModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteOrderModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4 text-capitalize">Confirm deleting this order ?</h5>
        <p className="text-capitalize">
          This order will be deleted permanently
        </p>
        {backErrors.length > 0 && <Alert variant="danger">{backErrors}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowDeleteOrderModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={deleteOrder}
          className="btn btn-success"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteOrderModal;

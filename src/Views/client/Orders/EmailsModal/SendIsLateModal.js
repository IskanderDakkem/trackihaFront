import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
//----------------------------------------------------------------------------
import {
  /* Row,
  Col,
  Card, */
  Modal,
  Button,
  /* Container,
  Form,
  InputGroup, */
} from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
import useAuth from "../../../../Context/useAuth";
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import { BASE_PATH } from "../../../../Context/Axios";
//--------------------------------------------------------------
function SendIsLateModal({
  sendIsLateModal,
  setSendIsLateModal,
  setSendIsLateEmailToast,
  selectedOrder,
}) {
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  //--------------------------------------------------------------
  const sendIsLateEmail = async () => {
    await axios
      .put(
        ApiLinks.Orders.sendIsLateEmail + selectedOrder,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200) {
          refresh();
          setSendIsLateModal(false);
          setSendIsLateEmailToast(true);
        }
      })
      .catch((err) => {});
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={sendIsLateModal}
      onHide={() => setSendIsLateModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setSendIsLateModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4 text-capitalize">Confirm this order is late ?</h5>
        <p className="text-capitalize">
          An email will be sent to the company that this's order will be late
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setSendIsLateModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={sendIsLateEmail}
          className="btn btn-success"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SendIsLateModal;

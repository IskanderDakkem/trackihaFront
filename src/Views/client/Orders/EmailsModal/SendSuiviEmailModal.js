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
/* import { Routes } from "../../../../Context/routes";
import { BASE_PATH } from "../../../../Context/Axios"; */
//--------------------------------------------------------------
function SendSuiviEmailModal({
  sendSuiviEmailModal,
  setSendSuiviEmailModal,
  setSendSuiviEmailToast,
  selectedOrder,
}) {
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  //--------------------------------------------------------------
  const sendIsFollowedEmail = async () => {
    await axios
      .post(ApiLinks.Orders.sendIsFollowedEmail + selectedOrder)
      .then((res) => {
        refresh();
        console.log(res);
      })
      .catch((err) => {
        /* console.log(err);
        const { response } = err;
        const { status } = response; */
      });
  };
  //--------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={sendSuiviEmailModal}
      onHide={() => setSendSuiviEmailModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setSendSuiviEmailModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm this order is followed ?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-black ms-auto btn btn-danger"
          onClick={() => setSendSuiviEmailModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={sendIsFollowedEmail}
          className="btn btn-success"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SendSuiviEmailModal;

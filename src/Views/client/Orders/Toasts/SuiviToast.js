import React from "react";
//-------------------------------------------------------------------
import { /*  Card, */ Toast, Button } from "@themesberg/react-bootstrap";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBootstrap } from "@fortawesome/free-brands-svg-icons"; */
//-------------------------------------------------------------------
import ToastContainer from "react-bootstrap/ToastContainer";
//-------------------------------------------------------------------
function SuiviToast({ sendSuiviEmailToast, setSendSuiviEmailToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={sendSuiviEmailToast}
        onClose={() => setSendSuiviEmailToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button size="xs" onClick={() => setSendSuiviEmailToast(false)} />
        </Toast.Header>
        <Toast.Body>The step was successfully created</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default SuiviToast;

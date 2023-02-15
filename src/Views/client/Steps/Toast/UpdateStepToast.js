import React from "react";
//---------------------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------------------
function UpdateStepToast({ showUpdateStepToast, setShowUpdateStepToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showUpdateStepToast}
        onClose={() => setShowUpdateStepToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowUpdateStepToast(false)}
          />
        </Toast.Header>
        <Toast.Body>This step was successfully updated</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------------------------
export default UpdateStepToast;

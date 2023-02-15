import React from "react";
//-------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//-------------------------------------------------------------------
function CreateStepToast({ showCreateStepToast, setShowCreateStepToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showCreateStepToast}
        onClose={() => setShowCreateStepToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowCreateStepToast(false)}
          />
        </Toast.Header>
        <Toast.Body>The step was successfully created</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//-------------------------------------------------------------------
export default CreateStepToast;

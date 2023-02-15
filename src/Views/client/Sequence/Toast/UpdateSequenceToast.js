import React from "react";
//---------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------
function UpdateSequenceToast({
  showUpdateSequenceToast,
  setShowUpdateSequenceToast,
}) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showUpdateSequenceToast}
        onClose={() => setShowUpdateSequenceToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowUpdateSequenceToast(false)}
          />
        </Toast.Header>
        <Toast.Body>This sequence was successfully updated</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------
export default UpdateSequenceToast;

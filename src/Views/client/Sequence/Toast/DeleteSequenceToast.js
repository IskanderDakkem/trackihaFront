import React from "react";
//---------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------
function DeleteSequenceToast({
  showDeleteSequenceToast,
  setShowDeleteSequenceToast,
}) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showDeleteSequenceToast}
        onClose={() => setShowDeleteSequenceToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowDeleteSequenceToast(false)}
          />
        </Toast.Header>
        <Toast.Body>This sequence was successfully deleted</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------
export default DeleteSequenceToast;

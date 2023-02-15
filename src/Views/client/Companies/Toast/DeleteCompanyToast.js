import React from "react";
//---------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------
function DeleteCompanyToast({
  showDeleteCompanyToast,
  setShowDeleteCompanyToast,
}) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showDeleteCompanyToast}
        onClose={() => setShowDeleteCompanyToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowDeleteCompanyToast(false)}
          />
        </Toast.Header>
        <Toast.Body>This company was successfully deleted</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------------
export default DeleteCompanyToast;

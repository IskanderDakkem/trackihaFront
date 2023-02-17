import React from "react";
//---------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------
function CreateCompanyToast({
  showCreateCompanyToast,
  setShowCreateCompanyToast,
}) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showCreateCompanyToast}
        onClose={() => setShowCreateCompanyToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowCreateCompanyToast(false)}
          />
        </Toast.Header>
        <Toast.Body>New company was added successfully</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------------
export default CreateCompanyToast;

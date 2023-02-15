import React from "react";
//---------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------
function UpdateCompanyToast({
  showUpdateCompanyToast,
  setShowUpdateCompanyToast,
}) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showUpdateCompanyToast}
        onClose={() => setShowUpdateCompanyToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowUpdateCompanyToast(false)}
          />
        </Toast.Header>
        <Toast.Body>This company was successfully updated</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------
export default UpdateCompanyToast;

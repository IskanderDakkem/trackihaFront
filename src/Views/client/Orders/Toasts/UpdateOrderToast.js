import React from "react";
//---------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------
function UpdateOrderToast({ setShowUpdateOrderToast, showUpdateOrderToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showUpdateOrderToast}
        onClose={() => setShowUpdateOrderToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowUpdateOrderToast(false)}
          />
        </Toast.Header>
        <Toast.Body>The company was successfully updated</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------------
export default UpdateOrderToast;

import React from "react";
//---------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------
function DeleteOrderToast({ showDeleteOrderToast, setShowDeleteOrderToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showDeleteOrderToast}
        onClose={() => setShowDeleteOrderToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowDeleteOrderToast(false)}
          />
        </Toast.Header>
        <Toast.Body>The order was successfully deleted</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default DeleteOrderToast;

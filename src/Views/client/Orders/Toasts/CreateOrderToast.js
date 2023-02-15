import React from "react";
//---------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------
function CreateOrderToast({ showCreateOrderToast, setShowCreateOrderToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showCreateOrderToast}
        onClose={() => setShowCreateOrderToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowCreateOrderToast(false)}
          />
        </Toast.Header>
        <Toast.Body>The order was successfully created</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------------
export default CreateOrderToast;

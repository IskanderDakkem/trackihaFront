import React from "react";
//---------------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------------
function DeliverOrderToast({ sendIsDeliveredToast, setSendIsDeliveredToast }) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={sendIsDeliveredToast}
        onClose={() => setSendIsDeliveredToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          <Button
            variant="close"
            size="xs"
            onClick={() => setSendIsDeliveredToast(false)}
          />
        </Toast.Header>
        <Toast.Body>The order was successfully delivered</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default DeliverOrderToast;

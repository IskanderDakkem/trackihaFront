import React from "react";
//---------------------------------------------------------------
import { Toast, Button } from "@themesberg/react-bootstrap";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBootstrap } from "@fortawesome/free-brands-svg-icons"; */
import ToastContainer from "react-bootstrap/ToastContainer";
//---------------------------------------------------------------
function CreateSequeneToast({
  showCreateSequenceToast,
  setShowCreateSequenceToast,
}) {
  return (
    <ToastContainer className="p-3" position={"bottom-end"}>
      <Toast
        show={showCreateSequenceToast}
        onClose={() => setShowCreateSequenceToast(false)}
        className="my-3"
        delay={10000}
        autohide
      >
        <Toast.Header className="text-primary" closeButton={false}>
          {/* <FontAwesomeIcon icon={faBootstrap} /> */}
          <Button
            variant="close"
            size="xs"
            onClick={() => setShowCreateSequenceToast(false)}
          />
        </Toast.Header>
        <Toast.Body>The sequence was successfully created</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
//---------------------------------------------------------------
export default CreateSequeneToast;

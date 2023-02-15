import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Alert, Spinner } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
//---------------------------------------------------------------------------------
function DeleteStepModal({
  showDeleteStepModal,
  setShowDeleteStepModal,
  setShowDeleteStepToast,
  selecteStep,
}) {
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const cancelDeleteOrder = () => {
    setLoadingButton(false);
    setBackErrors({});
    setShowDeleteStepModal(false);
  };
  const deleteThisStep = async () => {
    setBackErrors({});
    setLoadingButton(true);
    await axios
      .delete(ApiLinks.Steps.Delete + selecteStep, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setBackErrors({});
          setShowDeleteStepToast(true);
          setShowDeleteStepModal(false);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setBackErrors({
            ...backErrors,
            failed: "Something went wrong",
          });
        }
        if (err?.response?.status === 409) {
          setBackErrors({
            ...backErrors,
            alreadyused: "This step is assocaited with an other sequence",
          });
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
    setLoadingButton(false);
  };
  //---------------------------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteStepModal}
      onHide={() => setShowDeleteStepModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteStepModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this step ?</h5>
      </Modal.Body>
      {backErrors?.failed && (
        <Alert variant="danger">{backErrors?.failed}</Alert>
      )}
      {backErrors?.alreadyused && (
        <Alert variant="danger" className="mx-3">
          {backErrors?.alreadyused}
        </Alert>
      )}
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={cancelDeleteOrder}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={deleteThisStep}
          className="btn btn-success"
        >
          {loadingButton ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            "Confirm"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteStepModal;

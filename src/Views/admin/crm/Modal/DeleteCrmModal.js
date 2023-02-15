import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Alert, Spinner } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------------------
function DeleteCrmModal({
  showDeleteCrmModal,
  setShowDeleteCrmModal,
  selectedCrm,
}) {
  const Token = localStorage.getItem("Token");
  //---------------------------------------------------------------------------------
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const deleteCrm = async () => {
    setLoadingButton(true);
    await axios
      .delete(ApiLinks.Crm.Delete + selectedCrm, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setShowDeleteCrmModal(false);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setBackErrors({ ...backErrors, ops: "Something went wrong" });
        }
        if (err?.response?.status === 401) {
          localStorage.removeItem("admin_token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 409) {
          setBackErrors({
            ...backErrors,
            alreadyUsed: "This link already exists",
          });
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
    setLoadingButton(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteCrmModal}
      onHide={() => setShowDeleteCrmModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteCrmModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this crm ?</h5>
      </Modal.Body>
      {backErrors.ops && <Alert variant="danger">{backErrors.ops}</Alert>}
      {backErrors.alreadyUsed && (
        <Alert variant="danger">{backErrors.alreadyUsed}</Alert>
      )}
      <Modal.Footer>
        <Button
          variant="link"
          className="text-black ms-auto btn btn-danger"
          onClick={() => setShowDeleteCrmModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={deleteCrm}
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

export default DeleteCrmModal;

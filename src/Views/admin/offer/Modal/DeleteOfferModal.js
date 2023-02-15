import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Alert, Spinner } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------------------
function DeleteOfferModal({
  showDeleteOfferModal,
  setShowDeleteOfferModal,
  selectedOffer,
}) {
  //---------------------------------------------------------------------------------
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const deleteThisCompany = async () => {
    setLoadingButton(true);
    await axios
      .delete(ApiLinks.offers.delete + selectedOffer, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setShowDeleteOfferModal(false);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setBackErrors({
            ...backErrors,
            failed: "Something went wrong",
          });
        }
        if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 409) {
          setBackErrors({
            ...backErrors,
            alreadyused: "This company is already have an order!",
          });
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
      show={showDeleteOfferModal}
      onHide={() => setShowDeleteOfferModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteOfferModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this offer ?</h5>
      </Modal.Body>
      {backErrors.failed && <Alert variant="danger">{backErrors.failed}</Alert>}
      {backErrors.alreadyused && (
        <Alert variant="danger" className="mx-3">
          {backErrors.alreadyused}
        </Alert>
      )}
      <Modal.Footer>
        <Button
          variant="link"
          className="text-black ms-auto btn btn-danger"
          onClick={() => setShowDeleteOfferModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={deleteThisCompany}
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

export default DeleteOfferModal;

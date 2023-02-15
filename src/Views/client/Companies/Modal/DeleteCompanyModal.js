import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Alert, Spinner } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { BASE_PATH } from "../../../../Context/Axios";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------------------------------
function DeleteCompanyModal({
  showDeleteCompanyModal,
  setShowDeleteCompanyModal,
  setShowDeleteCompanyToast,
  SelectedCompany,
}) {
  const { setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------
  const deleteThisCompany = async () => {
    setLoadingButton(true);
    await axios
      .delete(ApiLinks.Company.delete + SelectedCompany, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setShowDeleteCompanyToast(true);
          setShowDeleteCompanyModal(false);
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
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
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
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteCompanyModal}
      onHide={() => setShowDeleteCompanyModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteCompanyModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this company ?</h5>
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
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowDeleteCompanyModal(false)}
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
//---------------------------------------------------------------------
export default DeleteCompanyModal;

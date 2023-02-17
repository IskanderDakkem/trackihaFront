import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------------------------------
function DeleteCompanyModal({
  showDeleteCompanyModal,
  setShowDeleteCompanyModal,
  setShowDeleteCompanyToast,
  SelectedCompany,
  refresh,
}) {
  // ** router
  const { setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  // ** functions
  const deleteThisCompany = async () => {
    setLoadingButton(true);
    try {
      const res = await axios.delete(
        ApiLinks.Company.delete + SelectedCompany,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 202) {
        setShowDeleteCompanyModal(false);
        refresh();
        setShowDeleteCompanyToast(true);
      }
    } catch (err) {
      // ** something is missing
      if (err?.response?.status === 400) {
        setBackErrors({
          ...backErrors,
          failed:
            "Ops! can't delete something is missing, Please refresh the page",
        });
      }
      // ** no token
      else if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // **  token expired
      else if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** already used
      else if (err?.response?.status === 409) {
        setBackErrors({
          ...backErrors,
          alreadyused: true,
        });
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
    setLoadingButton(false);
  };
  // ** on close
  const onHide = () => {
    setShowDeleteCompanyModal(false);
    setBackErrors({});
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteCompanyModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-4 text-center">Confirm deleting this company ?</h5>

          {backErrors.failed && (
            <p className="text-center text-danger">{backErrors.failed}</p>
          )}
          {backErrors.alreadyused && (
            <p className="text-center text-danger">
              This company is already used by an order, Please delete the order
              first
            </p>
          )}
        </Col>

        <Col xs={12} className="text-center mt-4 mb-3 pt-50">
          <Button
            variant="link"
            className="text-white ms-auto btn btn-danger me-2"
            onClick={() => setShowDeleteCompanyModal(false)}
            type="button"
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
        </Col>
      </Modal.Body>
    </Modal>
  );
}
//---------------------------------------------------------------------
export default DeleteCompanyModal;

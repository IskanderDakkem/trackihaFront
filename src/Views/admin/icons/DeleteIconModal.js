// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
// ** Api config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
//---------------------------------------------------------------------------------
function DeleteIconModal({
  showDeleteIconModal,
  setShowDeleteIconModal,
  selectedIcon,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  // **  on submit
  const onSubmit = async () => {
    setLoadingButton(true);
    try {
      const res = await axios.post(
        ApiLinks.Icons.Delete,
        { path: selectedIcon },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        onHide();
        refresh();
      }
    } catch (err) {
      // something is missing
      if (err?.response?.status === 400) {
        setBackErrors({
          failed: "Something went wrong",
        });
      }
      // no token
      else if (err?.response?.status === 401) {
        navigate.push(Routes.Signin.path);
        localStorage.removeItem("Token");
      }
      // expired
      else if (err?.response?.status === 403) {
        navigate.push(Routes.Signin.path);
        localStorage.removeItem("Token");
      }
      // already used
      else if (err?.response?.status === 409) {
        setBackErrors({
          alreadyused: "This company is already have an order!",
        });
      }
      // server error
      else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
    setLoadingButton(false);
  };
  // ** on close
  const onHide = () => {
    setBackErrors({});
    setShowDeleteIconModal();
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteIconModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-4">Confirm deleting this user ?</h5>
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
            onClick={onHide}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onSubmit}
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

export default DeleteIconModal;

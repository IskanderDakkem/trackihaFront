// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
// ** API config
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------------------
function DeleteUserModal({
  showDeleteUserModal,
  setShowDeleteUserModal,
  setShowDeleteUserToast,
  selectedUser,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const deleteThisUser = async () => {
    setLoadingButton(true);
    try {
      const res = await axios.delete(ApiLinks.Users.delete + selectedUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        onHide();
        refresh();
        setShowDeleteUserToast(true);
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        setBackErrors({
          failed:
            "Ops! Can't delete, Something is missing Please refresh the page",
        });
      }
      // no token
      else if (err?.response?.status === 401) {
        navigate.push(Routes.SigninAdmin.path);
        localStorage.removeItem("Token");
      }
      // expired
      else if (err?.response?.status === 403) {
        navigate.push(Routes.SigninAdmin.path);
        localStorage.removeItem("Token");
      }
      // server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
        localStorage.removeItem("Token");
      }
    }
    setLoadingButton(false);
  };
  // ** on close
  const onHide = () => {
    setShowDeleteUserModal();
    setBackErrors();
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteUserModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-4 text-center">Confirm deleting this user ?</h5>
          {/* {backErrors.failed && (
            <p className="text-center text-danger">{backErrors.failed}</p>
          )} */}
          <Col xs={12} className="text-center mt-4 mb-3 pt-50">
            <Button
              variant="link"
              className="text-white ms-auto btn btn-danger me-2"
              onClick={onHide}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={deleteThisUser}
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
        </Col>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteUserModal;

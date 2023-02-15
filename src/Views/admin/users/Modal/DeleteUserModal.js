import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Alert, Spinner } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------------------
function DeleteUserModal({
  showDeleteUserModal,
  setShowDeleteUserModal,
  setShowDeleteUserToast,
  selectedUser,
}) {
  //---------------------------------------------------------------------------------
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const deleteThisUser = async () => {
    setLoadingButton(true);
    await axios
      .delete(ApiLinks.Users.delete + selectedUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setShowDeleteUserModal(false);
          setShowDeleteUserToast(true);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setBackErrors({
            ...backErrors,
            failed: "Something went wrong",
          });
        }
        /* if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        } */
      });
    setLoadingButton(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteUserModal}
      onHide={() => setShowDeleteUserModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteUserModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this user ?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-black ms-auto btn btn-danger"
          onClick={() => setShowDeleteUserModal(false)}
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
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteUserModal;

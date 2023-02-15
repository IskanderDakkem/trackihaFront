import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Spinner } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
//---------------------------------------------------------------------------------
function DeleteIconModal({
  showDeleteIconModal,
  setShowDeleteIconModal,
  selectedIcon,
}) {
  //---------------------------------------------------------------------------------
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const deleteIcon = async () => {
    setLoadingButton(true);
    await axios
      .post(
        ApiLinks.Icons.Delete,
        { path: selectedIcon },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        setShowDeleteIconModal(false);
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
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteIconModal}
      onHide={() => setShowDeleteIconModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteIconModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this user ?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-black ms-auto btn btn-danger"
          onClick={() => setShowDeleteIconModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={deleteIcon}
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

export default DeleteIconModal;

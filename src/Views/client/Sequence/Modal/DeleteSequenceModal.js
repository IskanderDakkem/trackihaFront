import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------------------
import { Modal, Button, Spinner, Alert } from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { BASE_PATH } from "../../../../Context/Axios";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------------------------------
function DeleteSequenceModal({
  showDeleteSequenceModal,
  setShowDeleteSequenceModal,
  setShowDeleteSequenceToast,
  SelectedSequence,
}) {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [spinningButton, setSpinningButton] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------------------------
  const cancelDeleteSequence = () => {
    setSpinningButton(false);
    setShowDeleteSequenceModal(false);
    setBackErrors({});
  };
  const deleteSequenceHandler = async () => {
    setBackErrors({});
    setSpinningButton(true);
    await axios
      .delete(ApiLinks.Sequence.Delete + SelectedSequence, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setShowDeleteSequenceModal(false);
          setShowDeleteSequenceToast(true);
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
        if (err?.response?.status === 409) {
          setBackErrors({
            ...backErrors,
            alreadyused: "This sequence is already used with an",
          });
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
    setSpinningButton(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteSequenceModal}
      onHide={() => setShowDeleteSequenceModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowDeleteSequenceModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Confirm deleting this sequence ?</h5>
        {backErrors?.failed && (
          <Alert variant="danger">{backErrors?.failed}</Alert>
        )}
        {backErrors?.alreadyused && (
          <Alert variant="danger" className="mx-3">
            {backErrors?.alreadyused}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={cancelDeleteSequence}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={deleteSequenceHandler}
          className="btn btn-success"
        >
          {spinningButton ? (
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

export default DeleteSequenceModal;

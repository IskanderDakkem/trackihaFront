// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
// ** API config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//---------------------------------------------------------------------------------
function DeleteSequenceModal({
  showDeleteSequenceModal,
  setShowDeleteSequenceModal,
  setShowDeleteSequenceToast,
  SelectedSequence,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const { setAuth } = useAuth();
  const navigate = useHistory();
  // ** states
  const [spinningButton, setSpinningButton] = useState(false);
  const [errors, setErrors] = useState({});
  // ** functions
  const onHide = () => {
    setSpinningButton(false);
    setShowDeleteSequenceModal(false);
    setErrors({});
  };
  // ** on Submit
  const onSubmit = async () => {
    setErrors({});
    setSpinningButton(true);
    try {
      const res = await axios.delete(
        ApiLinks.Sequence.Delete + SelectedSequence,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 202) {
        onHide();
        setShowDeleteSequenceToast(true);
        refresh();
      }
    } catch (err) {
      // ** failed
      if (err?.response?.status === 400) {
        setErrors({
          failed: "Something went wrong",
        });
      }
      // **  no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** expired
      if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** used
      if (err?.response?.status === 409) {
        setErrors({
          used: "This sequence is already used with an",
        });
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
    setSpinningButton(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteSequenceModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-4 text-center">Confirm deleting this sequence ?</h5>
          {errors?.failed && (
            <p className="text-center text-danger">{errors?.failed}</p>
          )}
          {errors?.alreadyused && (
            <p className="text-center text-danger">{errors?.used}</p>
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
            {spinningButton ? (
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

export default DeleteSequenceModal;

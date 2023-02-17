// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** boot strap imports
import { Modal, Button, Spinner, Col } from "@themesberg/react-bootstrap";
// **  API config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
//---------------------------------------------------------------------------------
function DeleteStepModal({
  showDeleteStepModal,
  setShowDeleteStepModal,
  setShowDeleteStepToast,
  selecteStep,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  // ** states
  const [loadingButton, setLoadingButton] = useState(false);
  const [errors, setErrors] = useState({});
  // ** on hide
  const onHide = () => {
    setShowDeleteStepModal(false);
    setLoadingButton(false);
    setErrors({});
  };
  // ** on submit
  const onSubmit = async () => {
    setErrors({});
    setLoadingButton(true);
    try {
      const res = await axios.delete(ApiLinks.Steps.Delete + selecteStep, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        onHide();
        refresh();
        setShowDeleteStepToast();
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        setErrors({
          ...errors,
          failed:
            "Ops! can't delete, Something is missing, please rfresh the page",
        });
      } else if (err?.response?.status === 409) {
        setErrors({
          ...errors,
          alreadyused: "This step is assocaited with an other sequence",
        });
      } else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
    setLoadingButton(false);
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showDeleteStepModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Col>
          <h5 className="mb-5 text-center">Confirm deleting this step ?</h5>
          {errors?.failed && (
            <p className="text-center text-danger">{errors?.failed}</p>
          )}
          {errors?.alreadyused && (
            <p className="text-center text-danger">
              This step is used by an other sequence, Please delete the sequence
              related it it first
            </p>
          )}
        </Col>
        <Col xs={12} className="text-center mt-5 mb-3 pt-50">
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
            type="button"
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

export default DeleteStepModal;

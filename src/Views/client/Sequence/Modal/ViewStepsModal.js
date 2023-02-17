// ** react imports
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
import { Modal, Button } from "@themesberg/react-bootstrap";
// ** API config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { BASE_PATH } from "../../../../Context/Axios";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//-----------------------------------------------------------------
function ViewStepsModal({
  showViewSequenceSteps,
  setShowViewSequenceSteps,
  SelectedSequence,
}) {
  // ** router
  const { setAuth } = useAuth();
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  // ** states
  const [sequenceSteps, setSequenceSteps] = useState([]);
  // ** fetching data
  useEffect(() => {
    if (showViewSequenceSteps) {
      fetchOneSequence();
    }
  }, [showViewSequenceSteps, SelectedSequence]);
  // ** functions
  const fetchOneSequence = async () => {
    try {
      const res = await axios.get(
        ApiLinks.Sequence.getSequenceSteps + SelectedSequence,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        setSequenceSteps([...res?.data.Steps]);
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** expired token
      else if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** server error
      else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showViewSequenceSteps}
      onHide={() => setShowViewSequenceSteps(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowViewSequenceSteps(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around">
          {sequenceSteps.map((step) => {
            const { id, label, icone } = step;
            return (
              <div key={id} className="mb-3">
                <h6>{label}</h6>
                <img
                  src={BASE_PATH + icone}
                  alt="step icone"
                  style={{ height: "100px" }}
                />
              </div>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
}
//-----------------------------------------------------------------
export default ViewStepsModal;

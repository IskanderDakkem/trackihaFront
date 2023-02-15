import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//-----------------------------------------------------------------
import { Modal, Button, Row } from "@themesberg/react-bootstrap";
//-----------------------------------------------------------------
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
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  const [sequenceSteps, setSequenceSteps] = useState([]);
  useEffect(() => {
    const getSequenceSteps = async () => {
      await axios
        .get(ApiLinks.Sequence.getSequenceSteps + SelectedSequence, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          const { status, data } = res;
          if (status === 200) {
            setSequenceSteps(data?.Steps);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setAuth(null);
            localStorage.removeItem("Token");
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    };
    getSequenceSteps();
  }, [setShowViewSequenceSteps, showViewSequenceSteps]);
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
                  alt=""
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

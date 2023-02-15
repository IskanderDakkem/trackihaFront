import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
} from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------
function ViewOfferModal({
  showViewOfferModal,
  setShowViewOfferModal,
  selectedOffer,
}) {
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //-----------------------------------------------------------------
  const initialeState = {};
  const [newOffer, setNewOffer] = useState(initialeState);
  const getOffer = async () => {
    await axios
      .get(ApiLinks.offers.getOne + selectedOffer, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setNewOffer((prev) => res?.data?.item);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  useEffect(() => {
    if (
      selectedOffer !== null &&
      selectedOffer !== undefined &&
      selectedOffer !== 0
    ) {
      getOffer();
    }
  }, [showViewOfferModal, selectedOffer]);
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showViewOfferModal}
      onHide={() => setShowViewOfferModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowViewOfferModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">View</h5>
        <Col /* md={6} */ className="mb-3">
          <Form.Group id="firstName">
            <Form.Label>Offer Name</Form.Label>
            <InputGroup>
              <Form.Control disabled value={newOffer?.name} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col /* md={6} */ className="mb-3">
          <Form.Group id="firstName">
            <Form.Label>Number of companies allowed</Form.Label>
            <InputGroup>
              <Form.Control
                disabled
                value={
                  newOffer?.companies === -1 ? "infinity" : newOffer?.companies
                }
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col /* md={6} */ className="mb-3">
          <Form.Group id="firstName">
            <Form.Label>Number of orders allowed</Form.Label>
            <InputGroup>
              <Form.Control
                disabled
                value={newOffer?.orders === -1 ? "infinity" : newOffer?.orders}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col /* md={6} */ className="mb-3">
          <Form.Group id="firstName">
            <Form.Label>created at</Form.Label>
            <InputGroup>
              <Form.Control disabled value={newOffer?.createdAt} />
            </InputGroup>
          </Form.Group>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

export default ViewOfferModal;

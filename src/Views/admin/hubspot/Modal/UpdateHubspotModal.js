import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//---------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "@themesberg/react-bootstrap";
//---------------------------------------------------------------------
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
//---------------------------------------------------------------------
function UpdateHubspotModal({
  showUpdateHubspot,
  setShowUpdateHubsport,
  selectedHubspot,
}) {
  const navigate = useHistory();
  const Token = localStorage.getItem("Token");
  //-----------------------------------------------------------------
  const [apiLoading, setApiLoading] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  //-----------------------------------------------------------------
  const initialeState = {};
  const [newCrm, setNewCrm] = useState(initialeState);
  const getCrm = async () => {
    await axios
      .get(ApiLinks.Hubspot.getOne + selectedHubspot, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setNewCrm((prev) => res?.data?.item);
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getCrm();
  }, [showUpdateHubspot, selectedHubspot]);
  const onChange = (event) => {
    const { name, value } = event.target;
    setNewCrm({ ...newCrm, [name]: value });
  };
  //-----------------------------------------------------------------
  const onSubmit = async (event) => {
    event.preventDefault();
    setBackErrors({});
    setApiLoading(true);
    await axios
      .put(ApiLinks.Hubspot.Update + selectedHubspot, newCrm, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        setShowUpdateHubsport(false);
        setBackErrors({});
        setNewCrm(initialeState);
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setBackErrors({ ...backErrors, ops: "Something went wrong" });
        }
        if (err?.response?.status === 401) {
          localStorage.removeItem("admin_token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 406) {
          setBackErrors({
            ...backErrors,
            required: "All informations are required!",
          });
        }
        if (err?.response?.status === 409) {
          setBackErrors({
            ...backErrors,
            label: "This label already exists",
          });
        }
        if (err?.response?.status === 422) {
          setBackErrors({
            ...backErrors,
            link: "This link already exists",
          });
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
    setApiLoading(false);
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateHubspot}
      onHide={() => setShowUpdateHubsport(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowUpdateHubsport(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Update CRM</h5>
        <Col className="mb-3">
          <Form.Group id="firstName">
            <Form.Label>Label</Form.Label>
            <InputGroup>
              <Form.Control
                required
                type="text"
                name="label"
                value={newCrm?.label}
                onChange={onChange}
                placeholder="label ..."
              />
            </InputGroup>
          </Form.Group>
        </Col>
        {backErrors?.label && (
          <Alert variant="danger">{backErrors.label}</Alert>
        )}
        <Col className="mb-3">
          <Form.Group id="firstName">
            <Form.Label>Link</Form.Label>
            <InputGroup>
              <Form.Control
                required
                type="text"
                name="link"
                value={newCrm?.link}
                onChange={onChange}
                placeholder="link ..."
              />
            </InputGroup>
          </Form.Group>
        </Col>
        {backErrors?.link && <Alert variant="danger">{backErrors.link}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowUpdateHubsport(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="text-white btn btn-success"
          type="submit"
          onClick={onSubmit}
        >
          {apiLoading ? (
            <Spinner animation="border" variant="dark" />
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateHubspotModal;

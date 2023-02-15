import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//----------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Alert,
  Image,
  Spinner,
} from "@themesberg/react-bootstrap";
import {
  /* faFolderOpen,
  faEnvelope, */
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
//----------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
import { BASE_PATH } from "../../../Context/Axios";
//----------------------------------------------------------------
/* import Select from "react-select"; */
//----------------------------------------------------------------
function AddIconModal({ showAddIconModal, setShowAddIconModal }) {
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  //---------------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [loadingApi, setLoadingApi] = useState(false);
  //---------------------------------------------------------------
  const [newIcon, setNewIcon] = useState({
    preview: Profile3,
    raw: "",
    path: "",
  });
  const [iconName, setIconName] = useState("");
  const onChangeFile = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setNewIcon({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: files[0],
      });
    }
  };
  const handleSubmitNewIcon = async (event) => {
    event.preventDefault();
    const { raw } = newIcon;
    console.log("raw", raw);
    const formData = new FormData();
    formData.append("file", raw, `${iconName}.png`);
    await axios
      .post(ApiLinks.Icons.Upload + 0, formData, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 201) {
          setShowAddIconModal(false);
          setNewIcon({
            preview: Profile3,
            raw: "",
            path: "",
          });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
        }
        if (err?.response?.status === 401) {
        }
        if (err?.response?.status === 403) {
        }
        if (err?.response?.status === 404) {
        }
        if (err?.response?.status === 406) {
        }
        if (err?.response?.status === 409) {
        }
        if (err?.response?.status === 500) {
        }
      });
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showAddIconModal}
      onHide={() => setShowAddIconModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowAddIconModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Upload icon</h5>
        <Col className="mb-3">
          <Form.Group className="mb-3">
            <Col /* md={6} */ className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>Icon name</Form.Label>
                <InputGroup id="email">
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    placeholder="Enter your icone name"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <div className="d-xl-flex align-items-center">
              <div className="user-avatar xl-avatar">
                <Image
                  fluid
                  rounded
                  src={newIcon === null ? Profile3 : newIcon.preview}
                />
              </div>
              <div className="file-field">
                <div className="d-flex justify-content-xl-center ms-xl-3">
                  <div className="d-flex">
                    <span className="icon icon-md">
                      <FontAwesomeIcon icon={faPaperclip} className="me-3" />
                    </span>
                    <input type="file" name="file" onChange={onChangeFile} />
                    <div className="d-md-block text-start">
                      <div className="fw-normal text-dark mb-1">
                        Choose Icon
                      </div>
                      <div className="text-gray small">
                        PNG. Max size of 100K
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {inputErrors.raw && (
              <Alert variant="danger">{inputErrors.raw}</Alert>
            )}
          </Form.Group>
        </Col>
        <Modal.Footer>
          <Button
            variant="link"
            className="text-white ms-auto btn btn-danger"
            onClick={() => setShowAddIconModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmitNewIcon}
            className="btn btn-success"
          >
            {loadingApi ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              "Add"
            )}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
}

export default AddIconModal;

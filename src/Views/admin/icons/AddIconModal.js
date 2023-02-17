// ** react imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// ** boot strap imports
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Image,
  Spinner,
} from "@themesberg/react-bootstrap";
// ** icons imports
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
import { FormFeedback } from "reactstrap";
// ** Api config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
/* import useAuth from "../../../Context/useAuth"; */
//----------------------------------------------------------------
function AddIconModal({ showAddIconModal, setShowAddIconModal, refresh }) {
  // ** router
  const navigate = useHistory();
  /* const { Auth, setAuth } = useAuth(); */
  const Token = localStorage.getItem("Token");
  // ** initial state
  const initialIcon = {
    preview: Profile3,
    raw: null,
  };
  // ** states
  const [errors, setErrors] = useState({});
  const [loadingApi, setLoadingApi] = useState(false);
  const [newIcon, setNewIcon] = useState({
    ...initialIcon,
  });
  const [iconName, setIconName] = useState("");
  // ** on change
  const onChangeFile = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setNewIcon({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: files[0],
      });
    }
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoadingApi(true);
    const frontErrors = validate(iconName, newIcon);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      const formData = new FormData();
      formData.append("file", newIcon.raw, `${iconName}.png`);
      try {
        const res = await axios.post(ApiLinks.Icons.Upload, formData, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (res?.status === 201) {
          onHide();
          refresh();
        }
      } catch (err) {
        if (err?.response?.status === 400) {
          setErrors({
            icone:
              "Ops! Can't upload, Something is missing Please refresh the page",
          });
        }
        // no token
        else if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
          localStorage.removeItem("Token");
        }
        // expired
        else if (err?.response?.status === 403) {
          navigate.push(Routes.Signin.path);
          localStorage.removeItem("Token");
        }
        // server error
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
          localStorage.removeItem("Token");
        }
      }
    }
    setLoadingApi(false);
  };
  // ** validate form
  const validate = (name, icone) => {
    const errors = {};
    if (name === "") {
      errors.name = "This field is required !";
    }
    if (icone.row === null) {
      errors.icone = "This field is required !";
    }
    return errors;
  };
  // ** on close
  const onHide = () => {
    setErrors({});
    setIconName("");
    setNewIcon({ ...initialIcon });
    setShowAddIconModal(false);
  };
  return (
    <Modal as={Modal.Dialog} centered show={showAddIconModal} onHide={onHide}>
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Upload icon</h5>
        <Col className="mb-3">
          <Form.Group className="mb-3">
            <Col /* md={6} */ className="mb-3">
              <Form.Group>
                <Form.Label>Icon name</Form.Label>
                <InputGroup>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    placeholder="Enter your icone name"
                    isInvalid={errors.name && true}
                  />
                </InputGroup>
              </Form.Group>
              {errors.name && (
                <FormFeedback className="d-block">{errors.name}</FormFeedback>
              )}
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
            {errors.icone && (
              <FormFeedback className="d-block">{errors.icone}</FormFeedback>
            )}
          </Form.Group>
        </Col>
        <Modal.Footer>
          <Button
            variant="link"
            className="text-white ms-auto btn btn-danger"
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onSubmit}
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

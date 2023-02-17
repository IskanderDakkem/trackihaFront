// ** react imports
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap improts
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
// ** icons
import {
  faFolderOpen,
  faPaperclip,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg";
// ** api config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { BASE_PATH } from "../../../../Context/Axios";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
// ** packages
import Select from "react-select";
import { FormFeedback } from "reactstrap";
//----------------------------------------------------------------
function CreateStepModal({
  showCreateStepModal,
  setShowCreateStepModal,
  setShowCreateStepToast,
  refresh,
}) {
  // ** router
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  // ** initial state
  const intialIcon = {
    preview: Profile3,
    raw: null,
  };
  const initialStep = {
    label: "",
    abrv: "",
    select: false,
  };
  // ** states
  const [icons, setIcons] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingApi, setLoadingApi] = useState(false);
  const [showUploadIcon, setShowUploadIcon] = useState(false);
  const [newIcon, setNewIcon] = useState({ ...intialIcon });
  const [step, setStep] = useState({ ...initialStep });
  // ** fetching data
  useEffect(() => {
    if (showCreateStepModal) {
      getAlldefaultIcons();
    }
  }, [showCreateStepModal]);
  // ** functions
  const getAlldefaultIcons = async () => {
    try {
      const res = await axios.get(ApiLinks.Icons.getDefault, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        const data = res?.data?.Icons;
        data.forEach((item) => {
          setIcons((prev) => [
            ...prev,
            {
              value: item.path,
              label: (
                <div>
                  <img src={BASE_PATH + item.path} style={{ height: "80px" }} />
                </div>
              ),
            },
          ]);
        });
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** expired
      else if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
  };
  // ** on change file
  const onChangeFile = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setNewIcon({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: files[0],
      });
    }
  };
  // ** on change input fields
  const onChange = (event) => {
    const { name, value } = event.target;
    setStep({ ...step, [name]: value });
  };
  const onChangeIconFromList = (option) => {
    setStep({ ...step, icone: option.value, select: true });
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoadingApi(true);
    const frontErrors = validate(step, newIcon);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        let dataSent = step;
        if (!step.select) {
          console.log("hereeeeeeeeeeeeeeeeee");
          const formData = new FormData();
          formData.append("icone", newIcon.raw);
          formData.append("label", step.label);
          formData.append("abrv", step.abrv);
          formData.append("select", step.select || false);
          dataSent = formData;
        }
        const res = await axios.post(ApiLinks.Steps.Create + Auth, dataSent, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (res?.status === 201) {
          onHide();
          refresh();
          setShowCreateStepToast(true);
        }
      } catch (err) {
        console.log("##: ", err);
        // ** bad request
        if (err?.response?.status === 400) {
          setErrors({
            ops: "Something went wrong!",
          });
        }
        // ** no token
        else if (err?.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** expired
        else if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        // ** test
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === "LABEL"
        ) {
          setErrors({ label: "Already used by an other step" });
        }
        //
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === "ABRV"
        ) {
          setErrors({ abrv: "Already used by an other step" });
        }
        // ** server errors
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setLoadingApi(false);
  };
  // ** validate form
  const validate = (step, icon) => {
    const errors = {};
    // label
    if (step.label === "") {
      errors.label = "This field is required !";
    }
    // abrv
    if (step.abrv === "") {
      errors.abrv = "This field is required!";
    }
    if (step.icone === "" && !showUploadIcon) {
      errors.icone = "This field is required!";
    }
    // icon
    if (icon.raw === null && showUploadIcon) {
      errors.raw = "This field is required!";
    }
    return errors;
  };
  // ** on close
  const onHide = () => {
    setShowCreateStepModal(false);
    setErrors({});
    setStep({ ...initialStep });
    setNewIcon({ ...intialIcon });
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateStepModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create step</h5>
        <Form onSubmit={onSubmit}>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Label</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faFolderOpen} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="label"
                  value={step?.label}
                  onChange={onChange}
                  placeholder="Enter your step name"
                  isInvalid={errors.label && true}
                  required
                  autoFocus
                />
              </InputGroup>
            </Form.Group>
            {errors.label && (
              <FormFeedback className="d-block">{errors.label}</FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>abbreviation</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="abrv"
                  value={step?.abrv}
                  onChange={onChange}
                  placeholder="Enter your step name abbreviation"
                  isInvalid={errors.abrv && true}
                  required
                />
              </InputGroup>
            </Form.Group>
            {errors.abrv && (
              <FormFeedback className="d-block">{errors.abrv}</FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Select an icon</Form.Label>
              <Select
                options={icons}
                /* value={step?.icone} */
                name="icone"
                onChange={onChangeIconFromList}
                isDisabled={showUploadIcon}
              />
            </Form.Group>
            {errors?.icone && <Alert variant="danger">{errors?.icone}</Alert>}
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Or</Form.Label>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label
                onClick={() => setShowUploadIcon(!showUploadIcon)}
                style={{ cursor: "pointer" }}
              >
                Upload your personal icon ?
              </Form.Label>
              {showUploadIcon && (
                <div className="d-xl-flex align-items-center">
                  <div className="user-avatar xl-avatar">
                    <Image
                      fluid
                      rounded
                      src={newIcon === null ? Profile3 : newIcon?.preview}
                    />
                  </div>
                  <div className="file-field">
                    <div className="d-flex justify-content-xl-center ms-xl-3">
                      <div className="d-flex">
                        <span className="icon icon-md">
                          <FontAwesomeIcon
                            icon={faPaperclip}
                            className="me-3"
                          />
                        </span>
                        <input
                          type="file"
                          name="file"
                          onChange={onChangeFile}
                          required
                        />
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
              )}
              {errors?.ops && <Alert variant="danger">{errors?.ops}</Alert>}
            </Form.Group>
          </Col>
          <Col xs={12} className="text-center mt-4 mb-3 pt-50">
            <Button
              className="text-white ms-auto btn btn-danger me-2"
              onClick={onHide}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              type="submit"
              className="btn btn-success"
            >
              {loadingApi ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                "Create"
              )}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateStepModal;

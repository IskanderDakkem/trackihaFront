// ** react imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// ** bootstrap imports
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
import { FormFeedback } from "reactstrap";
// ** icons imports
import {
  faFolderOpen,
  faPaperclip,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg";
// ** API config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { BASE_PATH } from "../../../../Context/Axios";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
// ** react select
import Select from "react-select";
//----------------------------------------------------------------
function UpdateStepModal({
  showUpdateStepModal,
  setShowUpdateStepModal,
  setShowUpdateStepToast,
  selecteStep,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  // ** initial state
  const intialIcon = {
    preview: Profile3,
    raw: null,
  };
  // ** states
  const [icons, setIcons] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingApi, setLoadingApi] = useState(false);
  const [showUploadIcon, setShowUploadIcon] = useState(true);
  const [newIcon, setNewIcon] = useState({ ...intialIcon });
  const [step, setStep] = useState({ select: false });
  // ** fetch data
  useEffect(() => {
    if (showUpdateStepModal && selecteStep !== 0 && Auth !== null) {
      fetchOneStep();
      getAlldefaultIcons();
    }
  }, [showUpdateStepModal]);
  // ** on changes
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
  // ** functions
  const fetchOneStep = async () => {
    await axios
      .get(ApiLinks.Steps.getStep + selecteStep, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setNewIcon((prev) => ({
            ...prev,
            preview: BASE_PATH + res?.data?.item?.icone,
          }));
          setStep({ ...res?.data?.item, select: true });
        }
      })
      .catch((err) => {
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
        // ** server errors
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
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
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoadingApi(true);
    const frontErrors = validate(step, newIcon);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
      console.log("here ?");
      console.log("errors: ", frontErrors);
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        let dataSent = step;
        if (!step?.select) {
          console.log("hereeeeeeeeeeeeeeeeee");
          const formData = new FormData();
          formData.append("icone", newIcon.raw);
          formData.append("label", step.label);
          formData.append("abrv", step.abrv);
          formData.append("select", step.select || false);
          dataSent = formData;
        }
        console.log("data sent: ", dataSent);
        const res = await axios.put(
          ApiLinks.Steps.Update + selecteStep + "/" + Auth,
          dataSent,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 202) {
          onHide();
          refresh();
          setShowUpdateStepToast(true);
        }
      } catch (err) {
        console.log("err: ", err);
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
    /* if (icon.raw === null && showUploadIcon) {
      errors.raw = "This field is required!";
    } */
    return errors;
  };
  // ** on close
  const onHide = () => {
    setShowUpdateStepModal(false);
    setErrors({});
    setStep({});
    setNewIcon({ ...intialIcon });
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateStepModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Update step</h5>
        <Form>
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
                /* value={Step?.icone} */
                name="icone"
                onChange={onChangeIconFromList}
                isDisabled={showUploadIcon}
              />
            </Form.Group>
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
                Upload your own
              </Form.Label>
              {showUploadIcon && (
                <div className="d-xl-flex align-items-center">
                  <div className="user-avatar xl-avatar">
                    <Image
                      fluid
                      rounded
                      /* onLoad={onImgLoad} */
                      src={newIcon === null ? Profile3 : newIcon.preview}
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

              {errors.newIcon && (
                <Alert variant="danger" className="mx-3">
                  {errors.newIcon}
                </Alert>
              )}
            </Form.Group>
          </Col>
          <Col xs={12} className="text-center mt-4 mb-3 pt-50">
            <Button
              variant="link"
              className="text-white ms-auto btn btn-danger me-2"
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
                "Update"
              )}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateStepModal;

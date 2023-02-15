import React, { useState, useEffect } from "react";
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
  faFolderOpen,
  faPaperclip,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg";
//----------------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { BASE_PATH } from "../../../../Context/Axios";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//----------------------------------------------------------------
import Select from "react-select";
//----------------------------------------------------------------
function UpdateStepModal({
  showUpdateStepModal,
  setShowUpdateStepModal,
  setShowUpdateStepToast,
  selecteStep,
}) {
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  //----------------------------------------------------------------
  const [spinningButton, setSpinningButton] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------
  const [showUploadIcon, setShowUploadIcon] = useState(true);
  const [newIcon, setNewIcon] = useState({ preview: Profile3, raw: "" });
  const onChangeNewIcon = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setNewIcon({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: files[0],
      });
    }
  };
  //----------------------------------------------------------------
  const [Step, setStep] = useState({});
  const onChangeNewStep = (event) => {
    const { name, value } = event.target;
    setStep({ ...Step, [name]: value });
  };
  //----------------------------------------------------------------
  const getStep = async () => {
    await axios
      .get(ApiLinks.Steps.getStep + selecteStep, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          const { Step } = data;
          setNewIcon((prev) => ({ ...prev, preview: BASE_PATH + Step?.icone }));
          setStep({ ...Step });
        }
      })
      .catch((err) => {
        /*  if (err?.response?.status === 400) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        } */
        if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 406) {
        }
        if (err?.response?.status === 409) {
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  //----------------------------------------------------------------
  const getDefaultIcons = async () => {
    await axios
      .get(ApiLinks.Icons.getIcons + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const { data, status } = res;
        if (status === 200) {
          data.icons.forEach((item) => {
            setIcons((prev) => [
              ...prev,
              {
                value: item.path,
                label: (
                  <div>
                    <img
                      src={BASE_PATH + item.path}
                      style={{ height: "100px" }}
                      alt={"#"}
                    />
                  </div>
                ),
              },
            ]);
          });
        }
      })
      .catch((err) => {
        const { response } = err;
        const { status } = response;
        if (status === 400) {
          //Do someting
        }
        if (status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (response.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  //----------------------------------------------------------------
  const [icons, setIcons] = useState([]);
  useEffect(() => {
    if (selecteStep !== 0 && Auth !== null) {
      getStep();
      getDefaultIcons();
    }
  }, [selecteStep]);
  //---------------------------------------------------------------
  const handleSubmitUpdateStep = async (event) => {
    event.preventDefault();
    setInputErrors({});
    setBackErrors({});
    setInputErrors(validate(Step, newIcon));
    if (Object.keys(inputErrors).length === 0) {
      setSpinningButton(<i class="fas fa-truck-monster    "></i>);
      const { raw } = newIcon;
      //Upload the icon
      let verified = true;
      if (raw) {
        const formData = new FormData();
        formData.append("file", raw);
        await axios
          .post(ApiLinks.Icons.Upload + Auth, formData, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setShowUploadIcon(true);
            }
          })
          .catch((err) => {
            const { response } = err;
            const { status } = response;
            if (status === 406) {
              setBackErrors({
                ...backErrors,
                iconRequired: "The icon is required!",
              });
            }
            if (status === 404) {
              /* navigate.push(Routes.NotFound.path); */
            }
            if (status === 500) {
              navigate.push(Routes.ServerError.path);
            }
          });
      }
      if (verified) {
        await axios
          .put(ApiLinks.Steps.Update + selecteStep, Step, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          })
          .then((res) => {
            const { status } = res;
            if (status === 200) {
              setShowUpdateStepModal(false);
              setShowUpdateStepToast(true);
            }
          })
          .catch((err) => {
            const { response } = err;
            const { status } = response;
            if (status === 400) {
              setBackErrors({
                ...backErrors,
                Error: "Something went wrong!",
              });
            }
            if (status === 406) {
              setBackErrors({
                ...backErrors,
                required: "All informations are required!",
              });
            }
            if (status === 409) {
              setBackErrors({
                ...backErrors,
                exist: "This step already exists!",
              });
            }
            if (status === 404) {
              navigate.push(Routes.NotFound.path);
            }
            if (status === 500) {
              navigate.push(Routes.ServerError.path);
            }
          });
      }
      setSpinningButton(false);
    }
  };
  //---------------------------------------------------------------
  const validate = (values1, values2) => {
    const errors = {};
    const { label, abrv, icone } = values1;
    const { raw } = values2;
    if (!label) {
      errors.label = "Step label is required!";
    }
    if (!abrv) {
      errors.abrv = "Step abbreviation is required!";
    }
    if (!icone && !raw) {
      errors.icone = "Please select an existing icon!";
      errors.newIcon = "Or upload your own icon!";
    }
    if (raw && !icone) {
      const { size } = raw;
      if (size > 100000) {
        errors.size = "icon size can't surpass 100 KO";
      }
    }

    return errors;
  };
  //---------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateStepModal}
      onHide={() => setShowUpdateStepModal(false)}
    >
      <Modal.Header>
        <Button variant="close" onClick={() => setShowUpdateStepModal(false)} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create a step</h5>
        <form>
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
                  value={Step?.label}
                  onChange={onChangeNewStep}
                  placeholder="Enter your step name"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.label && (
              <Alert variant="danger">{inputErrors.label}</Alert>
            )}
            {backErrors.label && (
              <Alert variant="danger">{backErrors.label}</Alert>
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
                  value={Step?.abrv}
                  onChange={onChangeNewStep}
                  placeholder="Enter your step name abbreviation"
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.abrv && (
              <Alert variant="danger">{inputErrors.abrv}</Alert>
            )}
            {backErrors.abrv && (
              <Alert variant="danger">{backErrors.abrv}</Alert>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Select an icon</Form.Label>
              <Select
                options={icons}
                value={Step?.icone}
                name="icone"
                onChange={onChangeNewIcon}
                isDisabled={showUploadIcon}
              />
            </Form.Group>
            {inputErrors.icone && (
              <Alert variant="danger">{inputErrors.icone}</Alert>
            )}
            {backErrors.icone && (
              <Alert variant="danger">{backErrors.icone}</Alert>
            )}
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
                          onChange={onChangeNewIcon}
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

              {inputErrors.newIcon && (
                <Alert variant="danger" className="mx-3">
                  {inputErrors.newIcon}
                </Alert>
              )}
              {/* {inputErrors.size && (
                <Alert variant="danger" className="mx-3">
                  {inputErrors.size}
                </Alert>
              )} */}
              {/* {inputErrors.dimensions && (
                <Alert variant="danger" className="mx-3">
                  {inputErrors.dimensions}
                </Alert>
              )} */}
              {/* {backErrors.iconRequired && (
                <Alert variant="danger" className="mx-3">
                  {backErrors.iconRequired}
                </Alert>
              )} */}
            </Form.Group>
          </Col>
          {inputErrors.Error && (
            <Alert variant="danger" className="mx-3">
              {inputErrors.Error}
            </Alert>
          )}
          {inputErrors.required && (
            <Alert variant="danger" className="mx-3">
              {inputErrors.required}
            </Alert>
          )}
          {inputErrors.exist && (
            <Alert variant="danger" className="mx-3">
              {inputErrors.exist}
            </Alert>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowUpdateStepModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmitUpdateStep}
          className="btn btn-success"
        >
          {spinningButton ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateStepModal;

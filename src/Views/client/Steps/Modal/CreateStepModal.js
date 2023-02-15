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
function CreateStepModal({
  showCreateStepModal,
  setShowCreateStepModal,
  setShowCreateStepToast,
}) {
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  //---------------------------------------------------------------
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  const [loadingApi, setLoadingApi] = useState(false);
  //---------------------------------------------------------------
  const [icons, setIcons] = useState([]);
  useEffect(() => {
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
                      />
                    </div>
                  ),
                },
              ]);
            });
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
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
    if (Auth !== null || Auth !== undefined || Auth !== 0) {
      getDefaultIcons();
    }
  }, [showCreateStepModal, setShowCreateStepModal]);
  //---------------------------------------------------------------
  const [showUploadIcon, setShowUploadIcon] = useState(false);
  const [newIcon, setNewIcon] = useState({
    preview: Profile3,
    raw: "",
    path: "",
  });
  const onChangeFile = (event) => {
    const { files } = event.target;
    let icone = `/Assets/Clients/${Auth}/icons/${files[0]?.name}`;
    if (files.length > 0) {
      setNewIcon({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: files[0],
        path: icone,
      });
    }
    setStep({ ...Step, icone });
  };
  /* useEffect(() => {
    setInputErrors({});
    setBackErrors({});
  }, []); */
  //---------------------------------------------------------------
  const [Step, setStep] = useState({
    label: "",
    abrv: "",
    icone: "",
  });
  const onChangeNewStep = (event) => {
    const { name, value } = event.target;
    setStep({ ...Step, [name]: value });
  };
  const onChangeIcon = (option) => {
    setStep({ ...Step, icone: option.value });
  };
  //---------------------------------------------------------------
  const handleSubmitCreateStep = async (event) => {
    event.preventDefault();
    setInputErrors({});
    setBackErrors({});
    setInputErrors(validate(Step, newIcon));
    if (Object.keys(inputErrors).length === 0) {
      setLoadingApi(true);
      //if no icone upload
      //---------------------------------------------------------------
      if (showUploadIcon === false) {
        await axios
          .post(ApiLinks.Steps.Create + Auth, Step, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          })
          .then((res) => {
            if (res.status === 201) {
              setShowCreateStepToast(true);
              setShowCreateStepModal(false);
              setInputErrors({});
              setBackErrors({});
              setStep({
                label: "",
                abrv: "",
                icone: "",
              });
              setNewIcon({ preview: Profile3, raw: "" });
            }
          })
          .catch((err) => {
            if (err?.response?.status === 400) {
              setBackErrors({
                ...backErrors,
                Error: "Something went wrong!",
              });
            }
            if (err?.response?.status === 401) {
              setAuth(null);
              localStorage.removeItem("Token");
              navigate.push(Routes.Signin.path);
            } else if (err?.response?.status === 403) {
              setAuth(null);
              localStorage.removeItem("Token");
              navigate.push(Routes.Signin.path);
            } else if (err?.response?.status === 406) {
              setBackErrors({
                ...backErrors,
                required: "All informations are required!",
              });
            } else if (err?.response?.status === 409) {
              setBackErrors({
                ...backErrors,
                exist: "This step already exists!",
              });
            }
            if (err?.response?.status === 404) {
              navigate.push(Routes.NotFound.path);
            }
            if (err?.response?.status === 500) {
              navigate.push(Routes.ServerError.path);
            }
          });
      }
      if (showUploadIcon === true) {
        let verified = false;
        const { raw } = newIcon;
        const formData = new FormData();
        formData.append("file", raw);
        await axios
          .post(ApiLinks.Icons.Upload + Auth, formData, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          })
          .then((res) => {
            if (res?.status === 201) {
              verified = true;
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
        if (verified) {
          await axios
            .post(ApiLinks.Steps.Create + Auth, Step, {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            })
            .then((res) => {
              if (res.status === 201) {
                setShowCreateStepToast(true);
                setShowCreateStepModal(false);
                setStep({
                  label: "",
                  abrv: "",
                  icone: "",
                });
                setNewIcon({ preview: Profile3, raw: "" });
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
              if (status === 401) {
                setAuth(null);
                localStorage.removeItem("Token");
                navigate.push(Routes.Signin.path);
              }
              if (status === 403) {
                setAuth(null);
                localStorage.removeItem("Token");
                navigate.push(Routes.Signin.path);
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
      }
    }
    setLoadingApi(false);
  };
  //---------------------------------------------------------------
  const validate = (values1, values2) => {
    const errors = {};
    //If label doesnt exist
    if (!values1.label) {
      errors.label = "Label is required!";
    }
    //if abr desnt exist
    if (!values1.abrv) {
      errors.abrv = "Abbreviation is required!";
    }
    //if both icone and raw dont exist
    if (!values1.showUploadIcon && !values1.icone && !values1.raw) {
      errors.icone = "Please select an icon!";
      errors.raw = "Or upload your own icon!";
    }
    //in case not an upload
    if (!showUploadIcon) {
      if (values1.icone.length < 1) {
        errors.icone = "Please select at least 2 icons!";
      }
    }
    if (showUploadIcon) {
      if (!values2.raw) {
        errors.raw = "Pleast upload an icon!";
      }
    }
    return errors;
  };
  //---------------------------------------------------------------
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateStepModal}
      onHide={() => setShowCreateStepModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowCreateStepModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create a step</h5>
        <form onSubmit={handleSubmitCreateStep}>
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
            {inputErrors?.label && (
              <Alert variant="danger">{inputErrors?.label}</Alert>
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
            {inputErrors?.abrv && (
              <Alert variant="danger">{inputErrors?.abrv}</Alert>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Select an icon</Form.Label>
              <Select
                options={icons}
                value={Step?.icone}
                name="icone"
                onChange={onChangeIcon}
                isDisabled={showUploadIcon}
              />
            </Form.Group>
            {inputErrors?.icone && (
              <Alert variant="danger">{inputErrors?.icone}</Alert>
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
                Upload your own ?
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
              {inputErrors?.raw && (
                <Alert variant="danger">{inputErrors?.raw}</Alert>
              )}
              {backErrors?.Error && (
                <Alert variant="danger">{backErrors?.Error} </Alert>
              )}
              {backErrors?.required && (
                <Alert variant="danger">{backErrors?.required} </Alert>
              )}
              {backErrors?.exist && (
                <Alert variant="danger">{backErrors?.exist} </Alert>
              )}
            </Form.Group>
          </Col>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowCreateStepModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmitCreateStep}
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
      </Modal.Footer>
    </Modal>
  );
}

export default CreateStepModal;

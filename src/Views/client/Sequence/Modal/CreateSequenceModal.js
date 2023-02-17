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
  Spinner,
} from "@themesberg/react-bootstrap";
import { FormFeedback } from "reactstrap";
// ** icons imports
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// ** Api config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//----------------------------------------------------------------
function CreateSequenceModal({
  showCreateSequenceModal,
  setShowCreateSequenceModal,
  setShowCreateSequenceToast,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  // ** initial states
  const initialSequence = {
    name: "",
    label: "",
  };
  // ** states
  const [errors, setErrors] = useState({});
  const [Steps, setSteps] = useState([]);
  const [spinningButton, setSpinningButton] = useState(false);
  const [noMoreOptionsLeft, setNotMoreOptionsLeft] = useState(false);
  const [newSequence, setNewSequence] = useState({
    ...initialSequence,
  });
  const [AllowedOptions, setAllowedOptions] = useState([1]);
  const [SelectedOptions, setSelectedOptions] = useState([]);
  // ** fetching data
  useEffect(() => {
    if (showCreateSequenceModal && Auth !== null && Auth !== 0) {
      getUserSteps();
    }
  }, [showCreateSequenceModal]);
  // ** functiond
  const getUserSteps = async () => {
    try {
      const res = await axios.get(ApiLinks.Steps.getAllUserSteps + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setSteps([...res?.data?.Steps]);
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
  // ** on change
  const onChangeNewSequence = (event) => {
    const { name, value } = event.target;
    setNewSequence({ ...newSequence, [name]: value });
  };
  // ** ADD an option
  const addAnOtherOption = () => {
    if (SelectedOptions[AllowedOptions.length - 1]) {
    }
    if (AllowedOptions.length === Steps.length) {
      setNotMoreOptionsLeft(true);
    } else {
      setAllowedOptions((prev) => [...prev, AllowedOptions.length + 1]);
    }
  };
  // ** On Change an option
  const onChangeSelectedStep = (event, pos) => {
    const { value } = event.target;
    const newArray = [...SelectedOptions];
    if (
      SelectedOptions.length === 0 ||
      !(pos in SelectedOptions) ||
      !SelectedOptions[pos] === "undefined"
    ) {
      newArray.push(value);
    } else {
      newArray[pos] = value;
    }
    setSelectedOptions((prev) => [...newArray]);
  };
  // ** Remove an option
  const removeCurrentOption = (id, pos) => {
    setAllowedOptions(
      AllowedOptions.filter((optionId) => parseInt(optionId) !== parseInt(id))
    );
    setSelectedOptions(SelectedOptions.slice(pos, 0));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSpinningButton(true);
    const { name, label } = newSequence;
    const uploadSequence = {
      steps: SelectedOptions.join("||"),
      name,
      label,
    };
    const frontErrors = validate(uploadSequence);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.post(
          ApiLinks.Sequence.Create + Auth,
          uploadSequence,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 201) {
          onHide();
          setShowCreateSequenceToast(true);
          refresh();
        }
      } catch (err) {
        // ** bad request
        if (err?.response?.status === 400) {
          setErrors({
            ...errors,
            Failed: "Something went wrong",
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
        // ** name used
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === "NAME"
        ) {
          setErrors({
            ...errors,
            name: "This name is already used by an other sequence",
          });
        }
        // ** label used
        else if (
          err?.response?.status === 409 &&
          err?.response?.data?.code === "LABEL"
        ) {
          setErrors({
            ...errors,
            label: "This label is already used by an other sequence",
          });
        }
        // ** server error
        else if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      }
    }
    setSpinningButton(false);
  };
  // ** validate form
  const validate = (values) => {
    const errors = {};
    if (values.name.length === 0) {
      errors.name = "Name is required!";
    }
    if (values.label.length === 0) {
      errors.label = "Label is required!";
    }
    if (!values.steps) {
      errors.steps = "Select the steps first!";
    } else if (values.steps.length === 1) {
      errors.steps = "Select at least 2 steps!";
    }
    return errors;
  };
  // ** on close
  const onHide = () => {
    setShowCreateSequenceModal(false);
    setNewSequence({ ...initialSequence });
    setErrors({});
    setSelectedOptions([]);
    setAllowedOptions([1]);
    setNotMoreOptionsLeft(false);
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showCreateSequenceModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create a sequence</h5>
        <Form>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="name"
                  value={newSequence?.name}
                  onChange={onChangeNewSequence}
                  placeholder="Enter your sequence name"
                  isInvalid={errors.name && true}
                  required
                  autoFocus
                />
              </InputGroup>
            </Form.Group>
            {errors.name && (
              <FormFeedback className="d-block">{errors.name}</FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Label</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="label"
                  value={newSequence?.label}
                  onChange={onChangeNewSequence}
                  placeholder="Enter your sequence name"
                  isInvalid={errors.label && true}
                  required
                />
              </InputGroup>
            </Form.Group>
            {errors.label && (
              <FormFeedback className="d-block">{errors.label}</FormFeedback>
            )}
          </Col>
          <Col className="mb-3">
            {AllowedOptions.map((option) => {
              return (
                <Form.Group
                  className="mb-3"
                  key={AllowedOptions.indexOf(option)}
                >
                  <Form.Label>Select a step</Form.Label>
                  <div className="d-flex">
                    <Form.Select
                      onChange={(event) =>
                        onChangeSelectedStep(event, option - 1)
                      }
                      required
                    >
                      <option defaultValue>List of steps</option>
                      {Steps.length === 0 && (
                        <option defaultValue disabled>
                          Add some steps first
                        </option>
                      )}
                      {Steps.map((step) => {
                        const { id, label } = step;
                        return (
                          <option value={id} key={id}>
                            {label}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Button
                      className="ms-2 btn btn-primary"
                      onClick={addAnOtherOption}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    {AllowedOptions.length > 1 && (
                      <Button
                        className="ms-2 btn btn-danger"
                        onClick={() => removeCurrentOption(option, option - 1)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              );
            })}
            {noMoreOptionsLeft && (
              <FormFeedback className="d-block">
                No more options allowed!
              </FormFeedback>
            )}
            {errors.steps && (
              <FormFeedback className="d-block">{errors.steps}</FormFeedback>
            )}
          </Col>
          {errors?.Failed && (
            <p className="text-center text-danger">{errors?.Failed}</p>
          )}
          <Col xs={12} className="text-center mt-5 mb-3 pt-50">
            <Button
              variant="link"
              className="text-white ms-auto btn btn-danger me-2"
              onClick={onHide}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={onSubmit}
              className="btn btn-success"
              type="button"
            >
              {spinningButton ? (
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

export default CreateSequenceModal;

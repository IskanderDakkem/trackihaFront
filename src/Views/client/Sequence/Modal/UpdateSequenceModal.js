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
// ** API config
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//----------------------------------------------------------------
function UpdateSequenceModal({
  showUpdateSequenceModal,
  setShowUpdateSequenceModal,
  setShowUpdateSequenceToast,
  SelectedSequence,
  refresh,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  // ** states
  const [spinningButton, setSpinningButton] = useState(false);
  const [Steps, setSteps] = useState([]);
  const [noMoreOptionsLeft, setNotMoreOptionsLeft] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSequence, setNewSequence] = useState({});
  const [oldSelectedSequenceSteps, setOldSelectedSequenceSteps] = useState([]);
  const [AllowedOptions, setAllowedOptions] = useState([1]);
  const [SelectedOptions, setSelectedOptions] = useState([]);
  // ** fetching data
  useEffect(() => {
    if (showUpdateSequenceModal && Auth !== null && Auth !== 0) {
      getUserSteps();
    }
  }, [showUpdateSequenceModal]);
  useEffect(() => {
    if (
      showUpdateSequenceModal &&
      SelectedSequence !== null &&
      SelectedSequence !== undefined &&
      SelectedSequence !== 0
    ) {
      getSequence();
    }
  }, [showUpdateSequenceModal]);
  // ** functions
  const getUserSteps = async () => {
    try {
      const res = await axios.get(ApiLinks.Steps.getAllUserSteps + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setSteps((prev) => [...res?.data?.Steps]);
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** expired
      if (err?.response?.status === 403) {
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
  const getSequence = async () => {
    try {
      const res = await axios.get(
        ApiLinks.Sequence.getSequence + SelectedSequence,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        const Sequence = res?.data?.Sequence;
        setOldSelectedSequenceSteps((prev) => [...res?.data?.steps]);
        setNewSequence((prev) => ({ ...res?.data?.Sequence }));
        const { steps } = Sequence;
        //steps is a string: splitting it into an array
        const splitedSteps = steps.split("||");
        setAllowedOptions((prev) => []); //Emptying the prev allowed options: By default it had one items
        //Replacing by the nmber of items existed
        for (let i = 0; i < splitedSteps.length; i++) {
          setAllowedOptions((prev) => [...prev, i + 1]);
        }
        const prevSelectedStepName = [];
        //Replacing the selected options with this sequence options
        setOldSelectedSequenceSteps((prev) => [...prevSelectedStepName]);
        setSelectedOptions((prev) => [...splitedSteps]);
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** token expired
      if (err?.response?.status === 403) {
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
  // ** Ad an option
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
    const stringSteps = SelectedOptions.join("||");
    const { name, label } = newSequence;
    const uploadSequence = {
      steps: stringSteps,
      name,
      label,
    };
    const frontErrors = validate(uploadSequence);
    if (Object.keys(frontErrors).length > 0) {
      setErrors({ ...frontErrors });
    }
    if (Object.keys(frontErrors).length === 0) {
      try {
        const res = await axios.put(
          ApiLinks.Sequence.Update + SelectedSequence,
          uploadSequence,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (res?.status === 200) {
          onHide();
          refresh();
          setShowUpdateSequenceToast(true);
        }
      } catch (err) {
        // ** bad request
        if (err?.response?.status === 400) {
          setErrors({
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
        } // ** server error
        if (err?.response?.status === 500) {
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
    setShowUpdateSequenceModal(false);
    setNewSequence({});
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
      show={showUpdateSequenceModal}
      onHide={onHide}
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Update Sequence</h5>
        <Form onSubmit={onSubmit}>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={newSequence?.name}
                  onChange={onChangeNewSequence}
                  placeholder="Enter your sequence name"
                  isInvalid={errors.name && true}
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
                  required
                  type="text"
                  name="label"
                  value={newSequence?.label}
                  onChange={onChangeNewSequence}
                  placeholder="Enter your sequence name"
                  isInvalid={errors.label && true}
                />
              </InputGroup>
            </Form.Group>
            {errors.label && (
              <FormFeedback className="d-block">{errors.label}</FormFeedback>
            )}
          </Col>

          <Col className="mb-3">
            {AllowedOptions.map((option, index) => {
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
                      disabled
                      required
                    >
                      <option
                        value={oldSelectedSequenceSteps[index]?.id}
                        defaultChecked
                      >
                        {oldSelectedSequenceSteps[index]?.label}
                      </option>
                      {Steps.map((step) => {
                        const { id, label } = step;
                        return (
                          <option
                            disabled
                            value={SelectedOptions[Steps.indexOf(step) - 1]}
                            key={id}
                          >
                            {label}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Button
                      className="btn btn-primary"
                      onClick={addAnOtherOption}
                      disabled
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    {AllowedOptions.length > 1 && (
                      <Button
                        className="btn btn-danger"
                        onClick={() => removeCurrentOption(option, option - 1)}
                        disabled
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
            {errors?.Failed && (
              <p className="text-center text-danger">{errors?.Failed}</p>
            )}
          </Col>
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
              className="btn btn-success"
              type="submit"
            >
              {spinningButton ? (
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

export default UpdateSequenceModal;

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
  Spinner,
} from "@themesberg/react-bootstrap";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//----------------------------------------------------------------
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
}) {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [spinningButton, setSpinningButton] = useState(false);
  //---------------------------------------------------------------
  //getting all the steps
  const [Steps, setSteps] = useState([]);
  const getUserSteps = async () => {
    await axios
      .get(ApiLinks.Steps.getAllUserSteps + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const { data, status } = res;
        if (status === 200) {
          const { Steps } = data;
          setSteps((prev) => [...Steps]);
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
  useEffect(() => {
    if (Auth !== null && Auth !== 0) {
      getUserSteps();
    }
    getUserSteps();
  }, [showUpdateSequenceModal, SelectedSequence]);
  //---------------------------------------------------------------
  const [noMoreOptionsLeft, setNotMoreOptionsLeft] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------
  //Getting the sequene associated with this id
  const [newSequence, setNewSequence] = useState({});
  const [oldSelectedSequenceSteps, setOldSelectedSequenceSteps] = useState([]);
  const getSequence = async () => {
    await axios
      .get(ApiLinks.Sequence.getSequence + SelectedSequence, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          const { Sequence } = data;
          setNewSequence((prev) => ({ ...res?.data?.Sequence }));
          const { steps } = Sequence;
          //steps is a string: splitting it into an array
          const splitedSteps = steps.split("||");
          setAllowedOptions((prev) => []); //Emptying the prev allowed options: By default it had one items
          //Replacing by the nmber of items existed
          const prevSelectedStepName = [];
          for (let i = 0; i < splitedSteps.length; i++) {
            setAllowedOptions((prev) => [...prev, i + 1]);
            const getStep = Steps.find(
              (step) => parseInt(step.id) === parseInt(splitedSteps[i])
            );
            prevSelectedStepName.push(getStep.label);
          }
          //Replacing the selected options with this sequence options
          setOldSelectedSequenceSteps((prev) => [...prevSelectedStepName]);
          setSelectedOptions((prev) => [...splitedSteps]);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status === 400) {
          /* setAuth(null); 
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path); */
        }
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
  useEffect(() => {
    //when original renddering, its
    if (
      SelectedSequence !== null &&
      SelectedSequence !== undefined &&
      SelectedSequence !== 0
    ) {
      getSequence();
    }
  }, [SelectedSequence, showUpdateSequenceModal]);
  const onChangeNewSequence = (event) => {
    const { name, value } = event.target;
    setNewSequence({ ...newSequence, [name]: value });
  };
  //---------------------------------------------------------------
  const [AllowedOptions, setAllowedOptions] = useState([1]);
  const [SelectedOptions, setSelectedOptions] = useState([]);
  //ADD an option
  const addAnOtherOption = () => {
    if (SelectedOptions[AllowedOptions.length - 1]) {
    }
    if (AllowedOptions.length === Steps.length) {
      setNotMoreOptionsLeft(true);
    } else {
      setAllowedOptions((prev) => [...prev, AllowedOptions.length + 1]);
    }
  };
  //OnChange an option
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
  //Remove an option
  const removeCurrentOption = (id, pos) => {
    setAllowedOptions(
      AllowedOptions.filter((optionId) => parseInt(optionId) !== parseInt(id))
    );
    setSelectedOptions(SelectedOptions.slice(pos, 0));
  };
  //---------------------------------------------------------------
  const handleSubmitNewSequence = async (event) => {
    event.preventDefault();
    const stringSteps = SelectedOptions.join("||");
    setInputErrors({});
    setBackErrors({});
    const { name, label } = newSequence;
    const uploadSequence = {
      steps: stringSteps,
      name,
      label,
    };
    console.log(uploadSequence);
    setInputErrors(validate(uploadSequence));
    if (Object.keys(inputErrors).length === 0) {
      setSpinningButton(true);
      await axios
        .put(ApiLinks.Sequence.Create + SelectedSequence, uploadSequence, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setShowUpdateSequenceToast(true);
            setShowUpdateSequenceModal(false);
            setNewSequence({});
            setInputErrors({});
            setBackErrors({});
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            setBackErrors({
              ...backErrors,
              Failed: "Something went wrong",
            });
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 406) {
            setBackErrors({
              ...backErrors,
              Required: "All informations are required!",
            });
          }
          if (err?.response?.status === 409) {
            setBackErrors({
              ...backErrors,
              alreadyExist: "Similar sequence already exists",
            });
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
      setSpinningButton(false);
    }
  };
  const cancelUpdateSequence = () => {
    setShowUpdateSequenceModal(false);
    setSpinningButton(false);
    setBackErrors({});
  };
  //---------------------------------------------------------------
  const validate = (values) => {
    const errors = {};
    if (values.name.length === 0) {
      errors.name = "Name is required!";
    }
    if (values.label.length === 0) {
      errors.label = "Label is required!";
    }
    if (values.step && values.step.length === 0) {
      errors.steps = "Select the steps first!";
    } else if (values.steps.length === 1) {
      errors.steps = "Select at least 2 steps!";
    }

    return errors;
  };
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateSequenceModal}
      onHide={() => setShowUpdateSequenceModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowUpdateSequenceModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">Create a sequence</h5>
        <form>
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
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.name && (
              <Alert variant="danger">{inputErrors.name}</Alert>
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
                />
              </InputGroup>
            </Form.Group>
            {inputErrors.label && (
              <Alert variant="danger">{inputErrors.label}</Alert>
            )}
          </Col>
        </form>
        <Col className="mb-3">
          {AllowedOptions.map((option) => {
            return (
              <Form.Group className="mb-3" key={AllowedOptions.indexOf(option)}>
                <Form.Label>Select a step</Form.Label>
                <div className="d-flex">
                  <Form.Select
                    onChange={(event) =>
                      onChangeSelectedStep(event, option - 1)
                    }
                    required
                  >
                    <option defaultValue className="alert alert-primary">
                      {oldSelectedSequenceSteps[AllowedOptions.indexOf(option)]}
                    </option>
                    {Steps.map((step) => {
                      const { id, label } = step;
                      return (
                        <option
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
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  {AllowedOptions.length > 1 && (
                    <Button
                      className="btn btn-danger"
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
            <Alert variant="danger">No more options allowed!</Alert>
          )}
          {inputErrors?.steps && (
            <Alert variant="danger">{inputErrors?.steps}</Alert>
          )}
        </Col>
        {backErrors?.Required && (
          <Alert variant="danger">{backErrors?.Required}</Alert>
        )}
        {backErrors?.Failed && (
          <Alert variant="danger">{backErrors?.Failed}</Alert>
        )}
        {backErrors?.alreadyExist && (
          <Alert variant="danger">{backErrors?.alreadyExist}</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={cancelUpdateSequence}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmitNewSequence}
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

export default UpdateSequenceModal;

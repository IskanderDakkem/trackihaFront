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
/* import { BASE_PATH } from "../../../../Context/Axios"; */
import { Routes } from "../../../../Context/routes";
import useAuth from "../../../../Context/useAuth";
//----------------------------------------------------------------
function CreateSequenceModal({
  showCreateSequenceModal,
  setShowCreateSequenceModal,
  setShowCreateSequenceToast,
}) {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth } = useAuth();
  const navigate = useHistory();
  const [spinningButton, setSpinningButton] = useState(false);
  //---------------------------------------------------------------
  const [Steps, setSteps] = useState([]);
  useEffect(() => {
    const getUserSteps = async () => {
      await axios
        .get(ApiLinks.Steps.getAllUserSteps + Auth, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSteps((prev) => res?.data?.Steps);
          }
        })
        .catch((err) => {
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
    if (Auth !== null && Auth !== 0) {
      getUserSteps();
    }
  }, [showCreateSequenceModal]);
  //---------------------------------------------------------------
  const [noMoreOptionsLeft, setNotMoreOptionsLeft] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState({});
  //---------------------------------------------------------------
  const [newSequence, setNewSequence] = useState({
    name: "",
    label: "",
  });
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
    setInputErrors({});
    setBackErrors({});
    const { name, label } = newSequence;
    const uploadSequence = {
      steps: SelectedOptions.join("||"),
      name,
      label,
    };
    setInputErrors(validate(uploadSequence));
    if (Object.keys(inputErrors).length === 0) {
      setSpinningButton(true);
      await axios
        .post(ApiLinks.Sequence.Create + Auth, uploadSequence, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          if (res?.status === 201) {
            setShowCreateSequenceToast(true);
            setShowCreateSequenceModal(false);
            setNewSequence({
              name: "",
              label: "",
            });
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
  //---------------------------------------------------------------
  const validate = (values) => {
    const errors = {};
    if (values.name.length === 0) {
      errors.name = "Name is required!";
    }
    if (values.label.length === 0) {
      errors.label = "Label is required!";
    }
    if (!values.step) {
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
      show={showCreateSequenceModal}
      onHide={() => setShowCreateSequenceModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowCreateSequenceModal(false)}
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
            <Alert variant="danger">No more options allowed!</Alert>
          )}
          {inputErrors.steps && (
            <Alert variant="danger">{inputErrors.steps}</Alert>
          )}
        </Col>
        {backErrors.Required && (
          <Alert variant="danger">{backErrors.Required}</Alert>
        )}
        {backErrors.Failed && (
          <Alert variant="danger">{backErrors.Failed}</Alert>
        )}
        {backErrors.alreadyExist && (
          <Alert variant="danger">{backErrors.alreadyExist}</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="text-white ms-auto btn btn-danger"
          onClick={() => setShowCreateSequenceModal(false)}
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
            "Create"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateSequenceModal;

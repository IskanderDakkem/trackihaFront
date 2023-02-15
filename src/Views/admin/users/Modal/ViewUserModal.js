import React, { useState, useEffect } from "react";
/* import { useHistory } from "react-router-dom"; */
//---------------------------------------------------------------------
import {
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
  Image,
} from "@themesberg/react-bootstrap";
/* import {
  faFolderOpen,
  faPaperclip,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; */
import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg";
//---------------------------------------------------------------------
/* import { Routes } from "../../../../Context/routes"; */
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
import { BASE_PATH } from "../../../../Context/Axios";
//---------------------------------------------------------------------
function ViewUserModal({
  showViewUserModal,
  setShowViewUserModal,
  selectedUser,
}) {
  const Token = localStorage.getItem("Token");
  /* const navigate = useHistory(); */
  //-----------------------------------------------------------------
  const defaultUser = {
    avatar: "",
    CompanyName: "",
    ResponsableName: "",
    Email: "",
    Tel: "",
    OfferName: "",
    companiesNumberAllowed: "",
    OrdersNumberAllowed: "",
    companiesCreated: "",
    createdAt: "",
  };
  const [user, setUsers] = useState({ ...defaultUser });
  const getUser = async () => {
    await axios
      .get(ApiLinks.Users.getUser + selectedUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setUsers((prev) => res?.data?.item);
        }
      })
      .catch((err) => {
        console.log("response from view user modal: ", err);
        /* if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        } */
      });
  };
  useEffect(() => {
    if (
      selectedUser !== null &&
      selectedUser !== undefined &&
      selectedUser !== 0
    ) {
      getUser();
    }
  }, [showViewUserModal, selectedUser]);
  let accountState = {};
  if (user?.suspended === true) {
    accountState.content = "Account is suspended";
    accountState.cssClass = "text-danger";
  } else {
    accountState.content = "Account is active";
    accountState.cssClass = "text-primary";
  }
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showViewUserModal}
      onHide={() => setShowViewUserModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowViewUserModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">View user</h5>
        <Col className="mb-3">
          <div className="d-xl-flex align-items-center">
            <div className="user-avatar xl-avatar">
              <Image
                fluid
                rounded
                src={
                  user?.avatar === null ||
                  user?.avatar === undefined ||
                  user?.avatar === ""
                    ? Profile3
                    : BASE_PATH + user?.avatar
                }
              />
            </div>
          </div>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Account state</Form.Label>
            <InputGroup>
              <Form.Control disabled value={accountState.content} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Company Name</Form.Label>
            <InputGroup>
              <Form.Control disabled value={user?.CompanyName} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Responsable Name</Form.Label>
            <InputGroup>
              <Form.Control disabled value={user?.ResponsableName} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <Form.Control disabled value={user?.Email} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group id="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control disabled value={user?.Tel} />
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Selected offer</Form.Label>
            <Form.Control disabled value={user?.OfferName} />
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Number of companies allowed</Form.Label>
            <Form.Control disabled value={user?.companiesNumberAllowed} />
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Number of orders allowed</Form.Label>
            <Form.Control disabled value={user?.OrdersNumberAllowed} />
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Number of companies created</Form.Label>
            <Form.Control disabled value={user?.companiesCreated} />
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Created At</Form.Label>
            <Form.Control disabled value={user?.createdAt} />
          </Form.Group>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

export default ViewUserModal;

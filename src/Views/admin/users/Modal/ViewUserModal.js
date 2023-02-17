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
  Image,
} from "@themesberg/react-bootstrap";
// ** icons imports
import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg";
// ** Api config
import { Routes } from "../../../../Context/routes";
import ApiLinks from "../../../../Context/ApiLinks";
import axios from "../../../../Context/Axios";
import { BASE_PATH } from "../../../../Context/Axios";
//---------------------------------------------------------------------
function ViewUserModal({
  showViewUserModal,
  setShowViewUserModal,
  selectedUser,
}) {
  // ** router
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //-----------------------------------------------------------------
  // ** initial state
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
  // ** states
  const [user, setUsers] = useState({ ...defaultUser });
  // ** fetching data
  useEffect(() => {
    if (
      showViewUserModal &&
      selectedUser !== null &&
      selectedUser !== undefined &&
      selectedUser !== 0
    ) {
      getUser();
    }
  }, [showViewUserModal]);
  // ** functions
  const getUser = async () => {
    try {
      const res = await axios.get(ApiLinks.Users.getUser + selectedUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (res?.status === 200) {
        setUsers((prev) => ({ ...res?.data?.item }));
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        navigate.push(Routes.SigninAdmin.path);
      }
      // ** expired
      else if (err?.response?.status === 403) {
        navigate.push(Routes.SigninAdmin.path);
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
  };
  // ** status
  const status = {};
  // 1
  if (user?.suspended) {
    status.color = "danger";
    status.text = "Suspended";
  }
  // 2
  else if (!user?.suspended && user?.verified) {
    status.color = "success";
    status.text = "Verified";
  }
  // 3
  else if (!user?.suspended && !user?.verified) {
    status.color = "warning";
    status.text = "Not verified";
  }
  // ** ==>
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
            <Form.Label>#: </Form.Label>&nbsp;
            <span className="text-info">{user?.id}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Account status: </Form.Label>&nbsp;
            <span className={`text-${status.color}`}>{status.text}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Company name: </Form.Label>&nbsp;
            <span className="text-info">{user?.CompanyName}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Responsable name: </Form.Label>&nbsp;
            <span className="text-info">{user?.ResponsableName}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>E-mail: </Form.Label>&nbsp;
            <span className="text-info">{user?.Email}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Phone Number: </Form.Label>&nbsp;
            <span className="text-info">{user?.Tel}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Offer: </Form.Label>&nbsp;
            <span className="text-info">{user?.OfferName}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Companies number allowed: </Form.Label>&nbsp;
            <span className="text-info">{user?.companiesNumberAllowed} </span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Orders number allowed: </Form.Label>&nbsp;
            <span className="text-info">{user?.OrdersNumberAllowed}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Companies created: </Form.Label>&nbsp;
            <span className="text-info">{user?.companiesCreated}</span>
          </Form.Group>
        </Col>
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Created At: </Form.Label>&nbsp;
            <span className="text-info">
              {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </Form.Group>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

export default ViewUserModal;

// ** react imports
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
// ** api config
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import { BASE_PATH } from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
// ** icons imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faEye,
  faTrashAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
// ** bootstrap imports
import {
  Col,
  Row,
  Nav,
  Card,
  Table,
  Pagination,
  Form,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Image,
  Button,
} from "@themesberg/react-bootstrap";
// ** modals imports
import CreateUserModal from "./Modal/CreateUserModal";
import ViewUserModal from "./Modal/ViewUserModal";
import DeleteUserModal from "./Modal/DeleteUserModal";
import UpdateUserModal from "./Modal/UpdateUserModal";
//--------------------------------------------------------------
function UsersContent() {
  // ** router
  const Token = localStorage.getItem("Token");
  const { paginationNumber } = useAuth();
  const navigate = useHistory();
  // ** initial states
  let pagesNumber = [];
  // ** states
  const [users, setUsers] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [usersNumber, setUserssNumber] = useState(0);
  const [selectedUser, setSelectedUser] = useState(0);
  for (let i = 1; i < usersNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  // ** fetching data
  useEffect(() => {
    getAllUsers();
  }, [rowPerPage]);
  // ** functions
  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        ApiLinks.Users.getAll + `${rowPerPage}/${limitPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        setUsers([...res?.data?.items]);
        setUserssNumber(res?.data?.size);
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        navigate.push(Routes.SigninAdmin.path);
        localStorage.removeItem("Token");
      }
      // ** expired
      else if (err?.response?.status === 403) {
        navigate.push(Routes.SigninAdmin.path);
        localStorage.removeItem("Token");
      }
      // ** server error
      if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
        localStorage.removeItem("Token");
      }
    }
  };
  // **  pagination managaement
  const PaginatePage = (pageNumber) => {
    setRowPerPage((prev) => pageNumber);
    getAllUsers();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < usersNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  // ** modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  // ** toasts
  const [showCreateUserToast, setShowCreateUserToast] = useState(false);
  const [showDeleteUserToast, setShowDeleteUserToast] = useState(false);
  const [showUpdateUserToast, setShowUpdateUserToast] = useState(false);
  // ** modal functions
  const handleShowViewUser = (id) => {
    setShowViewUserModal(true);
    setSelectedUser((prev) => id);
  };
  const handleDeleteUser = (id) => {
    setShowDeleteUserModal(true);
    setSelectedUser((prev) => id);
  };
  const handleUpdateUser = (id) => {
    setShowUpdateUserModal(true);
    setSelectedUser((prev) => id);
  };
  // ** ==>
  return (
    <>
      {/* ------------------------------------------------------------------------ */}
      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={8} md={6} lg={3} xl={4}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search" />
            </InputGroup>
          </Col>
          <Col>
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Refresh the table</Tooltip>}
            >
              <button onClick={getAllUsers} className="btn btn-primary">
                refresh
              </button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Create a new user</Tooltip>}
            >
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateUserModal(true)}
              >
                Create
              </button>
            </OverlayTrigger>
          </Col>
        </Row>
      </div>
      {/* ------------------------------------------------------------------------ */}
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">#</th>
                {/* <th className="border-bottom">Avatar</th> */}
                <th className="border-bottom">Company name</th>
                <th className="border-bottom">Responsable name</th>
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Phone Number</th>
                <th className="border-bottom">Status</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const { id, CompanyName, ResponsableName, Email, Tel } = user;
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
                  <tr key={id}>
                    <td className="fw-normal text-centre">{id}</td>
                    <td>
                      <span className="fw-normal">{CompanyName}</span>
                    </td>
                    <td>
                      <span className="fw-normal ">{ResponsableName}</span>
                    </td>
                    <td>
                      <span className="fw-normal ">{Email}</span>
                    </td>
                    <td>
                      <span className="fw-normal ">{Tel}</span>
                    </td>
                    <td>
                      <span className={`fw-normal text-${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View the user</Tooltip>}
                      >
                        <Button
                          className="btn btn-warning p-2 ms-2"
                          onClick={() => handleShowViewUser(id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="icon-dark" />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View the user content</Tooltip>}
                      >
                        <Link
                          to={`/back/users/${id}`}
                          className="btn btn-warning p-2 ms-2"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="icon-dark"
                          />
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update the user</Tooltip>}
                      >
                        <button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateUser(id)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="icon-dark"
                          />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Delete the user</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteUser(id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="icon-dark"
                          />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
            <Nav>
              <Pagination className="mb-2 mb-lg-0">
                <Pagination.Prev onClick={() => prevPage(rowPerPage)}>
                  Previous
                </Pagination.Prev>
                {pagesNumber.map((pageNumber) => {
                  if (rowPerPage === pageNumber) {
                    return (
                      <Pagination.Item
                        active
                        key={pagesNumber.indexOf(pageNumber)}
                      >
                        {pageNumber}
                      </Pagination.Item>
                    );
                  }
                  return (
                    <Pagination.Item
                      key={pagesNumber.indexOf(pageNumber)}
                      onClick={() => PaginatePage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next onClick={() => nextPage(rowPerPage)}>
                  Next
                </Pagination.Next>
              </Pagination>
            </Nav>
            <small className="fw-bold">
              Showing <b>{users.length}</b> out of
              <b>{" " + usersNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      <CreateUserModal
        showCreateUserModal={showCreateUserModal}
        setShowCreateUserModal={setShowCreateUserModal}
        setShowCreateUserToast={setShowCreateUserToast}
        refresh={getAllUsers}
      />
      <ViewUserModal
        showViewUserModal={showViewUserModal}
        setShowViewUserModal={setShowViewUserModal}
        selectedUser={selectedUser}
      />
      <DeleteUserModal
        showDeleteUserModal={showDeleteUserModal}
        setShowDeleteUserModal={setShowDeleteUserModal}
        setShowDeleteUserTOast={setShowDeleteUserToast}
        selectedUser={selectedUser}
        refresh={getAllUsers}
      />
      <UpdateUserModal
        showUpdateUserModal={showUpdateUserModal}
        setShowUpdateUserModal={setShowUpdateUserModal}
        selectedUser={selectedUser}
        setShowUpdateUserToast={setShowUpdateUserToast}
        refresh={getAllUsers}
      />
    </>
  );
}

export default UsersContent;

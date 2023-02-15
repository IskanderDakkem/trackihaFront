import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
//--------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import { BASE_PATH } from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//--------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faEye,
  faTrashAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
//--------------------------------------------------------------
import CreateUserModal from "./Modal/CreateUserModal";
import ViewUserModal from "./Modal/ViewUserModal";
import DeleteUserModal from "./Modal/DeleteUserModal";
import UpdateUserModal from "./Modal/UpdateUserModal";
//--------------------------------------------------------------
function UsersContent() {
  const Token = localStorage.getItem("Token");
  const { paginationNumber } = useAuth();
  const navigate = useHistory();
  //--------------------------------------------------------------
  const [users, setUsers] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [usersNumber, setUserssNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < usersNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getAllUsers = async () => {
    await axios
      .get(ApiLinks.Users.getAll + `${rowPerPage}/${limitPerPage}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setUsers((prev) => res?.data?.items);
          setUserssNumber((prev) => res?.data?.count);
        }
      })
      .catch((err) => {
        console.log("from users: ", err);
        if (err?.response?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          navigate.push(Routes.Signin.path);
        }
        /* if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        } */
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  //--------------------------------------------------------------
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
  //--------------------------------------------------------------
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  //---------------------------------------------------------------------
  const [showCreateUserToast, setShowCreateUserToast] = useState(false);
  const [showDeleteUserToast, setShowDeleteUserToast] = useState(false);
  const [showUpdateUserToast, setShowUpdateUserToast] = useState(false);
  //---------------------------------------------------------------------
  useEffect(() => {
    getAllUsers();
  }, [
    rowPerPage,
    showCreateUserModal,
    showDeleteUserModal,
    showViewUserModal,
    showUpdateUserModal,
    showCreateUserToast,
    showDeleteUserToast,
    showUpdateUserToast,
  ]);
  //---------------------------------------------------------------------
  const [selectedUser, setSelectedUser] = useState(0);
  //---------------------------------------------------------------------
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
  //---------------------------------------------------------------------
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
                <th className="border-bottom">Avatar</th>
                <th className="border-bottom">Company name</th>
                <th className="border-bottom">Responsable name</th>
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Phone Number</th>
                <th className="border-bottom">Offer</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const {
                  id,
                  avatar,
                  CompanyName,
                  ResponsableName,
                  Email,
                  Tel,
                  OfferName,
                } = user;
                return (
                  <tr key={id}>
                    <td className="fw-normal text-centre">{id}</td>
                    <td>
                      <Image
                        src={
                          avatar === null ||
                          avatar === undefined ||
                          avatar === ""
                            ? Profile3
                            : BASE_PATH + avatar
                        }
                        style={{ height: "50px" }}
                      />
                    </td>
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
                      <span className="fw-normal ">{OfferName}</span>
                    </td>
                    <td>
                      {/* <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View the user</Tooltip>}
                      >
                        <Button
                          className="btn btn-warning p-2 ms-2"
                          onClick={() => handleShowViewUser(id)}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="icon-dark"
                          />
                        </Button>
                      </OverlayTrigger> */}
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View the user content</Tooltip>}
                      >
                        <Link
                          to={`/back/users/${id}`}
                          className="btn btn-warning p-2 ms-2"
                          /*onClick={() => handleShowViewUser(id)} */
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
      />
      <UpdateUserModal
        showUpdateUserModal={showUpdateUserModal}
        setShowUpdateUserModal={setShowUpdateUserModal}
        selectedUser={selectedUser}
        setShowUpdateUserToast={setShowUpdateUserToast}
      />
    </>
  );
}

export default UsersContent;

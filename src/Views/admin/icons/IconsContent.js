import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//--------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
/* import useAuth from "../../../Context/useAuth"; */
import { BASE_PATH } from "../../../Context/Axios";
//--------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  /* faEdit,
  faEye, */
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Nav,
  Card,
  Table,
  /*  Pagination, */
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  /*   Button, */
  Image,
  /* Spinner, */
} from "@themesberg/react-bootstrap";
import DeleteIconModal from "./DeleteIconModal";
import AddIconModal from "./AddIconModal";
//--------------------------------------------------------------
function IconsContent() {
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //--------------------------------------------------------------
  const [icons, setIcons] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(30);
  const [iconsNumber, setIconsNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < iconsNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getAllIcons = async () => {
    await axios
      .get(ApiLinks.Icons.getDefault, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setIcons((prev) => res?.data?.Icons);
        }
      })
      .catch((err) => {
        if (err?.reponse?.status === 401) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.reponse?.status === 403) {
          navigate.push(Routes.Signin.path);
        }
        if (err?.reponse?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.reponse?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  //--------------------------------------------------------------
  /* const PaginatePage = (pageNumber) => {
    setRowPerPage((prev) => pageNumber);
    getAllIcons();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < iconsNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  }; */
  //---------------------------------------------------------------------
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [showDeleteIconModal, setShowDeleteIconModal] = useState(false);
  const [showUpdateIconModal, setShowUpdateIconModal] = useState(false);
  //---------------------------------------------------------------------
  useEffect(() => {
    getAllIcons();
  }, [rowPerPage, showAddIconModal, showDeleteIconModal, showUpdateIconModal]);
  //---------------------------------------------------------------------
  const [selectedIcon, setSelectedIcon] = useState("");
  //---------------------------------------------------------------------
  const handleDeleteIconModal = (id) => {
    setSelectedIcon((prev) => id);
    setShowDeleteIconModal(true);
  };
  // ** get the img name
  const getIconName = (path) => {
    const name =
      ("sub string: ",
      path.substring(path.search("Default/") + "Default/".length));
    return name;
  };
  //---------------------------------------------------------------------
  return (
    <>
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
              <button onClick={getAllIcons} className="btn btn-primary">
                refresh
              </button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Add a new icon</Tooltip>}
            >
              <button
                className="btn btn-primary"
                onClick={() => setShowAddIconModal(true)}
              >
                Add
              </button>
            </OverlayTrigger>
          </Col>
        </Row>
      </div>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">#</th>
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Avatar</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {icons.map((icon) => {
                const { path } = icon;
                const id = icons.indexOf(icon);
                return (
                  <tr key={id}>
                    <td className="fw-normal">{id}</td>
                    <td>{getIconName(path)}</td>
                    <td>
                      <Image
                        src={BASE_PATH + path}
                        style={{ height: "50px" }}
                      />
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Delete this icon</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteIconModal(path)}
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
              {/* <Pagination className="mb-2 mb-lg-0">
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
              </Pagination> */}
            </Nav>
            <small className="fw-bold">
              Showing <b>{icons.length}</b> out of
              <b>{" " + iconsNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      <AddIconModal
        showAddIconModal={showAddIconModal}
        setShowAddIconModal={setShowAddIconModal}
      />
      <DeleteIconModal
        showDeleteIconModal={showDeleteIconModal}
        setShowDeleteIconModal={setShowDeleteIconModal}
        selectedIcon={selectedIcon}
      />
    </>
  );
}

export default IconsContent;

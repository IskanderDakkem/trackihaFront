import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//--------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
//--------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrashAlt,
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
} from "@themesberg/react-bootstrap";
import CreateCRMmodal from "./Modal/CreateCRMmodal";
import DeleteCrmModal from "./Modal/DeleteCrmModal";
import UpdateCrmModal from "./Modal/UpdateCrmModal";
import useAuth from "./../../../Context/useAuth";
//--------------------------------------------------------------
function CrmContent() {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth, paginationNumber } = useAuth();
  const navigate = useHistory();
  // -----------------------------------------------------------
  const [crm, setCrm] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(30);
  const [CrmNumber, setCrmNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < CrmNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getCRM = async () => {
    await axios
      .get(ApiLinks.Crm.getAll + `/${rowPerPage}/${limitPerPage}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          const { data } = res;
          const { items, count } = data;
          setCrm((prev) => [...items]);
          setCrmNumber((prev) => count);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setAuth(false);
          localStorage.removeItem("admin_token");
          navigate.push(Routes.SigninAdmin.path);
        }
        if (err?.response?.status === 401) {
          setAuth(false);
          localStorage.removeItem("admin_token");
          navigate.push(Routes.SigninAdmin.path);
        }
        if (err?.response?.status === 403) {
          setAuth(false);
          localStorage.removeItem("admin_token");
          navigate.push(Routes.SigninAdmin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  //--------------------------------------------------------------
  const PaginatePage = (pageNumber) => {
    setRowPerPage((prev) => pageNumber);
    getCRM();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < CrmNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  //---------------------------------------------------------------------
  const [showCreateCrmModal, setShowCreateCrmModal] = useState(false);
  const [showDeleteCrmModal, setShowDeleteCrmModal] = useState(false);
  const [showUpdateCrmModal, setShowUpdateCrmModal] = useState(false);
  //---------------------------------------------------------------------
  useEffect(() => {
    getCRM();
  }, [showCreateCrmModal, showDeleteCrmModal, showUpdateCrmModal]);
  //---------------------------------------------------------------------
  const [selectedCrm, setSelectedCrm] = useState(0);
  //---------------------------------------------------------------------
  const handleDeleteCrm = (id) => {
    setShowDeleteCrmModal(true);
    setSelectedCrm((prev) => id);
  };
  const handleUpdateCrm = (id) => {
    setShowUpdateCrmModal(true);
    setSelectedCrm((prev) => id);
  };
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
              <button onClick={getCRM} className="btn btn-primary">
                Refresh
              </button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Add CRM</Tooltip>}
            >
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateCrmModal(true)}
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
                <th className="border-bottom ">#</th>
                <th className="border-bottom ">label</th>
                <th className="border-bottom ">Link</th>
                <th className="border-bottom ">created At</th>
                <th className="border-bottom ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crm.map((cr) => {
                const { id, label, link, createdAt } = cr;
                return (
                  <tr key={id}>
                    <td className="fw-normal text-centre">{id}</td>
                    <td>
                      <span className="fw-normal text-centre  w-100">
                        {label}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal text-centre  w-100">
                        {link}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal text-centre">
                        {new Date(createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update the crm</Tooltip>}
                      >
                        <button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateCrm(id)}
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
                        overlay={<Tooltip>Delete the crm</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteCrm(id)}
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
              Showing <b>{crm.length}</b> out of
              <b>{" " + CrmNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      <CreateCRMmodal
        showCreateCrmModal={showCreateCrmModal}
        setShowCreateCrmModal={setShowCreateCrmModal}
      />
      <DeleteCrmModal
        showDeleteCrmModal={showDeleteCrmModal}
        setShowDeleteCrmModal={setShowDeleteCrmModal}
        selectedCrm={selectedCrm}
      />
      <UpdateCrmModal
        showUpdateCrmModal={showUpdateCrmModal}
        setShowUpdateCrmModal={setShowUpdateCrmModal}
        selectedCrm={selectedCrm}
      />
    </>
  );
}

export default CrmContent;

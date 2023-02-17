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
import CreateHubspotModal from "./Modal/CreateHubspotModal";
import DeleteHubspotModal from "./Modal/DeleteHubspotModal";
import UpdateHubspotModal from "./Modal/UpdateHubspotModal";
import useAuth from "../../../Context/useAuth";
function HubspotContent() {
  const Token = localStorage.getItem("Token");
  const { Auth, setAuth, paginationNumber } = useAuth();
  const navigate = useHistory();
  // -----------------------------------------------------------
  const [hubspots, setHubspots] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [HubspotsNumber, setHubspotsNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < HubspotsNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getHubSpots = async () => {
    await axios
      .get(ApiLinks.Hubspot.getAll + `/${rowPerPage}/${limitPerPage}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setHubspots((prev) => res?.data.items);
          setHubspotsNumber((prev) => res?.data?.count);
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
    getHubSpots();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < HubspotsNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  //---------------------------------------------------------------------
  const [showCreateHubsport, setShowCreateHubsport] = useState(false);
  const [showDeleteHubspot, setShowDeleteHubspot] = useState(false);
  const [showUpdateHubspot, setShowUpdateHubsport] = useState(false);
  //---------------------------------------------------------------------
  useEffect(() => {
    getHubSpots();
  }, [rowPerPage, showCreateHubsport, showDeleteHubspot, showUpdateHubspot]);
  //---------------------------------------------------------------------
  const [selectedHubspot, setSelectedHubspot] = useState(0);
  //---------------------------------------------------------------------
  const handelDeleteHubspot = (id) => {
    setShowDeleteHubspot(true);
    setSelectedHubspot((prev) => id);
  };
  const handleUpdateHubspot = (id) => {
    setShowUpdateHubsport(true);
    setSelectedHubspot((prev) => id);
  };
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
              <button onClick={getHubSpots} className="btn btn-primary">
                Refresh
              </button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Add Logistics</Tooltip>}
            >
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateHubsport(true)}
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
              {hubspots.map((hub) => {
                const { id, label, link, createdAt } = hub;
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
                          onClick={() => handleUpdateHubspot(id)}
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
                          onClick={() => handelDeleteHubspot(id)}
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
              Showing <b>{hubspots.length}</b> out of
              <b>{" " + HubspotsNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      <CreateHubspotModal
        showCreateHubsport={showCreateHubsport}
        setShowCreateHubsport={setShowCreateHubsport}
      />
      <DeleteHubspotModal
        showDeleteHubspot={showDeleteHubspot}
        setShowDeleteHubspot={setShowDeleteHubspot}
        selectedHubspot={selectedHubspot}
      />
      <UpdateHubspotModal
        selectedHubspot={selectedHubspot}
        setShowUpdateHubsport={setShowUpdateHubsport}
        showUpdateHubspot={showUpdateHubspot}
      />
    </>
  );
}

export default HubspotContent;

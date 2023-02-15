import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//--------------------------------------------------------------
import { RefreshCw } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faEye,
  faTrashAlt,
  faPlus,
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
  Button,
} from "@themesberg/react-bootstrap";
//--------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//--------------------------------------------------------------
import CreateSequenceModal from "./Modal/CreateSequenceModal";
import CreateSequeneToast from "./Toast/CreateSequenceToast";

import DeleteSequenceModal from "./Modal/DeleteSequenceModal";
import DeleteSequenceToast from "./Toast/DeleteSequenceToast";

import ViewStepsModal from "./Modal/ViewStepsModal";

import UpdateSequenceModal from "./Modal/UpdateSequenceModal";
import UpdateSequenceToast from "./Toast/UpdateSequenceToast";
//--------------------------------------------------------------
function SequenceContent({ clientId }) {
  const { Auth, setAuth, paginationNumber } = useAuth();
  let Token = localStorage.getItem("Token");
  let searchedId = Auth;
  if (clientId) {
    searchedId = clientId;
  }
  const navigate = useHistory();
  //--------------------------------------------------------------
  /*  const [tableLoading, setTableLoading] = useState(false); */
  //--------------------------------------------------------------
  const [sequences, setSequences] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [sequenceNumber, setSequenceNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < sequenceNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getClientSequence = async () => {
    await axios
      .get(
        ApiLinks.Sequence.getClientSequence +
          searchedId +
          `/${rowPerPage}/${limitPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200) {
          setSequences((prev) => res?.data?.items);
          setSequenceNumber(res?.data?.count);
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
        if (err?.response.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };

  //--------------------------------------------------------------
  const PaginatePage = (pageNumber) => {
    setRowPerPage((prev) => pageNumber);
    getClientSequence();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < sequenceNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  //---------------------------------------------------------------------
  const [showCreateSequenceModal, setShowCreateSequenceModal] = useState(false); //Create
  const [showDeleteSequenceModal, setShowDeleteSequenceModal] = useState(false); //Delete
  const [showUpdateSequenceModal, setShowUpdateSequenceModal] = useState(false); //Update
  const [showViewSequenceSteps, setShowViewSequenceSteps] = useState(false); //View
  //---------------------------------------------------------------------
  const [showCreateSequenceToast, setShowCreateSequenceToast] = useState(false); //Create
  const [showDeleteSequenceToast, setShowDeleteSequenceToast] = useState(false); //Delete
  const [showUpdateSequenceToast, setShowUpdateSequenceToast] = useState(false); //Update
  useEffect(() => {
    if (searchedId !== null && searchedId !== 0 && searchedId !== undefined) {
      getClientSequence();
    }
  }, [
    rowPerPage,
    showCreateSequenceModal,
    showDeleteSequenceModal,
    showUpdateSequenceModal,
    showViewSequenceSteps,
    showCreateSequenceToast,
    showDeleteSequenceToast,
    showUpdateSequenceToast,
  ]);
  //---------------------------------------------------------------------
  const [SelectedSequence, setSelectedSequence] = useState(0);
  //---------------------------------------------------------------------
  const handleshowViewSequenceSteps = (SequenceSteps) => {
    setShowViewSequenceSteps(true);
    setSelectedSequence((prev) => SequenceSteps);
  };
  const handleDeleteSequenceModal = (id) => {
    setShowDeleteSequenceModal(true);
    setSelectedSequence((prev) => id);
  };
  const handleUpdateSequenceModal = (Sequence) => {
    setShowUpdateSequenceModal(true);
    setSelectedSequence((prev) => Sequence);
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
              <Button onClick={getClientSequence} className="btn btn-primary">
                <RefreshCw size={20} />
              </Button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Create a new sequence</Tooltip>}
            >
              <Button
                className="btn btn-primary"
                onClick={() => setShowCreateSequenceModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
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
                <th className="border-bottom">Name</th>
                <th className="border-bottom">label</th>
                <th className="border-bottom">Steps</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sequences.map((sequence) => {
                const { id, name, label, steps } = sequence;
                return (
                  <tr key={id}>
                    <td className="fw-normal">{id}</td>
                    <td>
                      <span className="fw-normal">{name}</span>
                    </td>
                    <td>
                      <span className="fw-normal">{label}</span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        <OverlayTrigger
                          placement="bottom"
                          trigger={["hover", "focus"]}
                          overlay={<Tooltip>View the sequence steps</Tooltip>}
                        >
                          <button
                            className="btn btn-warning p-2 ms-2"
                            onClick={() => handleshowViewSequenceSteps(steps)}
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              className="icon-dark"
                            />
                          </button>
                        </OverlayTrigger>
                      </span>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update sequence</Tooltip>}
                      >
                        <button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateSequenceModal(id)}
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
                        overlay={<Tooltip>Delete sequence</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteSequenceModal(id)}
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
                      <Pagination.Item key={pageNumber} active>
                        {pageNumber}
                      </Pagination.Item>
                    );
                  }
                  return (
                    <Pagination.Item
                      key={pageNumber}
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
              Showing <b>{sequences.length}</b> out of{" "}
              <b>{" " + sequenceNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      {/* ------------------------------------------------------------------------ */}
      <CreateSequenceModal
        showCreateSequenceModal={showCreateSequenceModal}
        setShowCreateSequenceModal={setShowCreateSequenceModal}
        setShowCreateSequenceToast={setShowCreateSequenceToast}
      />
      <CreateSequeneToast
        showCreateSequenceToast={showCreateSequenceToast}
        setShowCreateSequenceToast={setShowCreateSequenceToast}
      />

      <DeleteSequenceModal
        showDeleteSequenceModal={showDeleteSequenceModal}
        S
        setShowDeleteSequenceModal={setShowDeleteSequenceModal}
        setShowDeleteSequenceToast={setShowDeleteSequenceToast}
        SelectedSequence={SelectedSequence}
      />
      <DeleteSequenceToast
        showDeleteSequenceToast={showDeleteSequenceToast}
        setShowDeleteSequenceToast={setShowDeleteSequenceToast}
      />

      <ViewStepsModal
        showViewSequenceSteps={showViewSequenceSteps}
        setShowViewSequenceSteps={setShowViewSequenceSteps}
        SelectedSequence={SelectedSequence}
      />

      <UpdateSequenceModal
        showUpdateSequenceModal={showUpdateSequenceModal}
        setShowUpdateSequenceModal={setShowUpdateSequenceModal}
        setShowUpdateSequenceToast={setShowUpdateSequenceToast}
        SelectedSequence={SelectedSequence}
      />
      <UpdateSequenceToast
        showUpdateSequenceToast={showUpdateSequenceToast}
        setShowUpdateSequenceToast={setShowUpdateSequenceToast}
      />
    </>
  );
}

export default SequenceContent;

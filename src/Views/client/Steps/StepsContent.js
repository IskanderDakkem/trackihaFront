// ** react imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// ** icons imports
import { RefreshCw } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faSearch,
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
  Button,
  OverlayTrigger,
} from "@themesberg/react-bootstrap";
// ** api configuration
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
import { BASE_PATH } from "../../../Context/Axios";
// ** create modal and toast
import CreateStepModal from "./Modal/CreateStepModal";
import CreateStepToast from "./Toast/CreateStepToast";
// ** delete modal and toast
import DeleteStepModal from "./Modal/DeleteStepModal";
import DeleteStepToast from "./Toast/DeleteStepToast";
// ** update modal and toast
import UpdateStepModal from "./Modal/UpdateStepModal";
import UpdateStepToast from "./Toast/UpdateStepToast";
//--------------------------------------------------------------------
function StepsContent({ clientId }) {
  const { Auth, setAuth, paginationNumber } = useAuth();
  let Token = localStorage.getItem("Token");
  let searchedId = Auth;
  if (clientId) {
    searchedId = clientId;
  }
  const navigate = useHistory();
  //---------------------------------------------------------------
  const [StepsList, setStepsList] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [stepsNumber, setStepsNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < stepsNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getAllUserSteps = async () => {
    await axios
      .get(
        ApiLinks.Steps.getUserSteps +
          searchedId +
          `/${rowPerPage}/${limitPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setStepsList((prev) => res?.data?.items);
          setStepsNumber((prev) => res?.data?.count);
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

  //--------------------------------------------------------------
  const PaginatePage = (pageNumber) => {
    setRowPerPage((prev) => pageNumber);
    getAllUserSteps();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < stepsNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  //--------------------------------------------------------------------
  const [showCreateStepModal, setShowCreateStepModal] = useState(false);
  const [showViewStepModal, setShowViewStepModal] = useState(false);
  const [showDeleteStepModal, setShowDeleteStepModal] = useState(false);
  const [showUpdateStepModal, setShowUpdateStepModal] = useState(false);
  //--------------------------------------------------------------------
  const [showCreateStepToast, setShowCreateStepToast] = useState(false);
  const [showDeleteStepToast, setShowDeleteStepToast] = useState(false);
  const [showUpdateStepToast, setShowUpdateStepToast] = useState(false);
  useEffect(() => {
    if (searchedId !== null && searchedId !== undefined && searchedId !== 0) {
      getAllUserSteps();
    }
  }, [
    rowPerPage,
    showCreateStepToast,
    showCreateStepModal,
    showDeleteStepModal,
    showUpdateStepModal,
    showDeleteStepToast,
    showUpdateStepToast,
  ]);
  //--------------------------------------------------------------------
  const [selecteStep, setSelecteStep] = useState(0);
  //--------------------------------------------------------------------
  const handleShowViewStepModal = (id) => {
    setShowViewStepModal(true);
    setSelecteStep((prev) => id);
  };
  const handleDeleteStep = (id) => {
    setShowDeleteStepModal(true);
    setSelecteStep((prev) => id);
  };
  const handleUpdateStep = (id) => {
    setShowUpdateStepModal(true);
    setSelecteStep((prev) => id);
  };
  //--------------------------------------------------------------------
  return (
    <>
      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={8} md={6} lg={3} xl={4}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search for a step" />
            </InputGroup>
          </Col>
          <Col>
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Refresh the table</Tooltip>}
            >
              <Button onClick={getAllUserSteps} className="btn btn-primary">
                <RefreshCw size={20} />
              </Button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Create a new step</Tooltip>}
            >
              <Button
                className="btn btn-primary"
                onClick={() => setShowCreateStepModal(true)}
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
                <th className="border-bottom">icone</th>
                <th className="border-bottom">label</th>
                <th className="border-bottom">abbreviation</th>
                <th className="border-bottom">Action</th>
              </tr>
            </thead>
            {/* ------------------------------------------------------------------------ */}
            <tbody>
              {StepsList.map((step) => {
                const { id, label, abrv, icone } = step;

                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>
                      <img src={BASE_PATH + icone} style={{ height: "50px" }} />
                    </td>
                    <td>
                      <span className="fw-normal text-center">{label}</span>
                    </td>
                    <td>
                      <span className="fw-normal text-center">{abrv}</span>
                    </td>

                    <td className="text-dark m-0 p-0">
                      {/* <button
                        className="btn btn-warning p-2
                      ms-2"
                        onClick={handleShowViewStepModal}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button> */}
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update step</Tooltip>}
                      >
                        <button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateStep(id)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Delete step</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteStep(id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {/* ------------------------------------------------------------------------ */}
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
            {StepsList.length === 0 ? (
              <small className="fw-bold">Table is empty</small>
            ) : (
              <small className="fw-bold">
                Showing <b>{StepsList.length}</b> out of
                <b>{" " + stepsNumber + " "}</b> entries
              </small>
            )}
          </Card.Footer>
        </Card.Body>
      </Card>
      {/* ----------------------------------------------------------- */}
      <CreateStepModal
        showCreateStepModal={showCreateStepModal}
        setShowCreateStepModal={setShowCreateStepModal}
        setShowCreateStepToast={setShowCreateStepToast}
      />
      <CreateStepToast
        showCreateStepToast={showCreateStepToast}
        setShowCreateStepToast={setShowCreateStepToast}
      />

      <DeleteStepModal
        showDeleteStepModal={showDeleteStepModal}
        setShowDeleteStepModal={setShowDeleteStepModal}
        setShowDeleteStepToast={setShowDeleteStepToast}
        selecteStep={selecteStep}
      />
      <DeleteStepToast
        showDeleteStepToast={showDeleteStepToast}
        setShowDeleteStepToast={setShowDeleteStepToast}
      />

      <UpdateStepModal
        showUpdateStepModal={showUpdateStepModal}
        setShowUpdateStepModal={setShowUpdateStepModal}
        setShowUpdateStepToast={setShowUpdateStepToast}
        selecteStep={selecteStep}
      />
      <UpdateStepToast
        showUpdateStepToast={showUpdateStepToast}
        setShowUpdateStepToast={setShowUpdateStepToast}
      />
    </>
  );
}
export default StepsContent;

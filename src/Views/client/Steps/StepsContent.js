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
// ** Bootstrap imports
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
// ** Modals
import CreateStepModal from "./Modal/CreateStepModal";
import DeleteStepModal from "./Modal/DeleteStepModal";
import UpdateStepModal from "./Modal/UpdateStepModal";
// ** toasts
import CreateStepToast from "./Toast/CreateStepToast";
import DeleteStepToast from "./Toast/DeleteStepToast";
import UpdateStepToast from "./Toast/UpdateStepToast";
//--------------------------------------------------------------------
function StepsContent({ clientId }) {
  // ** router
  const { Auth, setAuth, paginationNumber } = useAuth();
  let Token = localStorage.getItem("Token");
  let searchedId = Auth;
  if (clientId) {
    searchedId = clientId;
  }
  const navigate = useHistory();
  // ** initial states
  let pagesNumber = [];
  // ** states
  const [StepsList, setStepsList] = useState([]);
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [stepsNumber, setStepsNumber] = useState(0);
  const [selecteStep, setSelecteStep] = useState(0);
  for (let i = 1; i < stepsNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  // ** fetching data
  useEffect(() => {
    if (searchedId !== null && searchedId !== undefined && searchedId !== 0) {
      getAllUserSteps();
    }
  }, [rowPerPage]);
  // ** functions
  const getAllUserSteps = async () => {
    try {
      const res = await axios.get(
        ApiLinks.Steps.getUserSteps +
          searchedId +
          `/${rowPerPage}/${limitPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (res?.status === 200) {
        setStepsList((prev) => [...res?.data?.items]);
        setStepsNumber((prev) => res?.data?.count);
      }
    } catch (err) {
      // ** no token
      if (err?.response?.status === 401) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** expired
      else if (err?.response?.status === 403) {
        setAuth(null);
        localStorage.removeItem("Token");
        navigate.push(Routes.Signin.path);
      }
      // ** server error
      else if (err?.response?.status === 500) {
        navigate.push(Routes.ServerError.path);
      }
    }
  };
  // ** pagination management
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
  // ** create modal
  const [showCreateStepModal, setShowCreateStepModal] = useState(false);
  const [showCreateStepToast, setShowCreateStepToast] = useState(false);
  // ** delete
  const [showDeleteStepModal, setShowDeleteStepModal] = useState(false);
  const handleDeleteStep = (id) => {
    setShowDeleteStepModal(true);
    setSelecteStep((prev) => id);
  };
  const [showDeleteStepToast, setShowDeleteStepToast] = useState(false);
  // ** Update
  const [showUpdateStepModal, setShowUpdateStepModal] = useState(false);
  const handleUpdateStep = (id) => {
    setShowUpdateStepModal(true);
    setSelecteStep((prev) => id);
  };
  const [showUpdateStepToast, setShowUpdateStepToast] = useState(false);
  // ** ==>
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
                <th className="border-bottom">created At</th>
                <th className="border-bottom">Action</th>
              </tr>
            </thead>
            {/* ------------------------------------------------------------------------ */}
            <tbody>
              {StepsList.map((step) => {
                const { id, label, abrv, icone, createdAt } = step;
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
                    <td>
                      <span className="fw-normal text-center">
                        {new Date(createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-dark m-0 p-0">
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
        refresh={getAllUserSteps}
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
        refresh={getAllUserSteps}
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
        refresh={getAllUserSteps}
      />
      <UpdateStepToast
        showUpdateStepToast={showUpdateStepToast}
        setShowUpdateStepToast={setShowUpdateStepToast}
      />
    </>
  );
}
export default StepsContent;

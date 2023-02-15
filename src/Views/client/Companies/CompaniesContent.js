import React, { useEffect, useState } from "react";
import { useHistory, removeErrorParam, useLocation } from "react-router-dom";
//--------------------------------------------------------------
// ** api configuration
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//--------------------------------------------------------------
import { RefreshCw, Search, X } from "react-feather";
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
  OverlayTrigger,
  Tooltip,
  Button,
} from "@themesberg/react-bootstrap";
//--------------------------------------------------------------
import ViewCompanyModal from "./Modal/ViewCompanyModal";
//--------------------------------------------------------------
import DeleteCompanyModal from "./Modal/DeleteCompanyModal";
import DeleteCompanyToast from "./Toast/DeleteCompanyToast";
//--------------------------------------------------------------
import UpdateCompanyModal from "./Modal/UpdateCompanyModal";
import UpdateCompanyToast from "./Toast/UpdateCompanyToast";
//--------------------------------------------------------------
import CreateCompanyModal from "./Modal/CreateCompanyModal";
import CreateCompanyToast from "./Toast/CreateCompanyToast";
//--------------------------------------------------------------
const searchOptions = [
  { name: "id", value: "id" },
  { name: "Responsable name", value: "responsableName" },
  { name: "CompanyName", value: "companyName" },
  { name: "Email", value: "email" },
  { name: "Phone Number", value: "phoneNumber" },
];
//--------------------------------------------------------------
function CompaniesContent({ clientId }) {
  const location = useLocation();
  const history = useHistory();
  const { Auth, setAuth, paginationNumber } = useAuth();
  let Token = localStorage.getItem("Token");
  let searchedId = Auth;
  if (clientId) {
    searchedId = clientId;
  }
  const navigate = useHistory();
  //--------------------------------------------------------------
  const [companies, setCompanies] = useState([]); //Getting the companies
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [companiesNumber, setCompaniesNumber] = useState(0);
  const initiatlQueryState = {
    query: "",
    by: "All",
  };
  const [queries, setQueries] = useState({ ...initiatlQueryState });
  const onChange = (event) => {
    const { name, value } = event.target;
    setQueries((prev) => ({ ...prev, [name]: value }));
  };
  const onSearch = (event) => {
    event.preventDefault();
    setRowPerPage(1);
    getCLientCompanies();
  };
  const refreshQueries = () => {
    console.log("clicked");
    setQueries({ ...initiatlQueryState });
    setRowPerPage(1);
    getCLientCompanies();
  };
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < companiesNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getCLientCompanies = async () => {
    await axios
      .get(
        ApiLinks.Company.getClientCompanies +
          searchedId +
          `/${rowPerPage}/${limitPerPage}?by=${queries.by}&query=${queries.query}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200) {
          setCompanies((prev) => [...res?.data?.items]);
          setCompaniesNumber((prev) => res?.data?.count);
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
    getCLientCompanies();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < companiesNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  //---------------------------------------------------------------------
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false); //Create
  const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState(false); //Delete
  const [showUpdateCompanyModal, setShowUpdateCompanyModal] = useState(false); //Update
  const [showViewCompanyModal, setShowViewCompanyModal] = useState(false); //View
  //---------------------------------------------------------------------
  const [showCreateCompanyToast, setShowCreateCompanyToast] = useState(false); //Create
  const [showDeleteCompanyToast, setShowDeleteCompanyToast] = useState(false); //Delete
  const [showUpdateCompanyToast, setShowUpdateCompanyToast] = useState(false); //Update
  useEffect(() => {
    if (searchedId !== null && searchedId !== undefined && searchedId !== 0) {
      getCLientCompanies();
    }
  }, [
    rowPerPage,
    showDeleteCompanyToast,
    showCreateCompanyModal,
    showDeleteCompanyModal,
    showUpdateCompanyModal,
    showViewCompanyModal,
    showUpdateCompanyToast,
    showCreateCompanyToast,
  ]);
  //---------------------------------------------------------------------
  const [SelectedCompany, setSelectedCompany] = useState(0);
  //---------------------------------------------------------------------
  const handleShowViewCompanyModal = (company) => {
    setShowViewCompanyModal(true);
    setSelectedCompany((prev) => company);
  };
  const handleDeleteCompanyModal = (id) => {
    setShowDeleteCompanyModal(true);
    setSelectedCompany((prev) => id);
  };
  const handleUpdateCompanyModal = (id) => {
    setShowUpdateCompanyModal(true);
    setSelectedCompany((prev) => id);
  };
  //---------------------------------------------------------------------
  return (
    <>
      {/* ------------------------------------------------------------------------ */}
      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={10} md={8} lg={6} xl={6}>
            <Form className="d-flex gap-2" onSubmit={onSearch}>
              <Form.Select
                className="w-25"
                name="by"
                value={queries.by}
                onChange={onChange}
              >
                <option defaultChecked value="all">
                  All
                </option>
                {searchOptions.map((option, index) => {
                  return (
                    <option value={option.value} key={`option-${index}`}>
                      {option.name}
                    </option>
                  );
                })}
              </Form.Select>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className="w-50"
                  name="query"
                  value={queries.query}
                  onChange={onChange}
                  required
                />
              </InputGroup>
              <OverlayTrigger
                placement="bottom"
                trigger={["hover", "focus"]}
                overlay={<Tooltip>Search for something specific</Tooltip>}
              >
                <Button type="submit" className="btn btn-primary">
                  <Search size={20} />
                </Button>
              </OverlayTrigger>
            </Form>
          </Col>

          <Col>
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Refresh the queries</Tooltip>}
            >
              <Button onClick={refreshQueries} className="btn btn-primary">
                <X size={20} />
              </Button>
            </OverlayTrigger>
          </Col>

          <Col
            xs={4}
            md={2}
            xl={1}
            className="ps-md-0 text-end d-flex gap-3 me-3"
          >
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Create a new company</Tooltip>}
            >
              <Button
                className="btn btn-primary"
                onClick={() => setShowCreateCompanyModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Refresh the table</Tooltip>}
            >
              <Button
                className="btn btn-primary"
                onClick={getCLientCompanies}
                /* onClick={() => setShowCreateCompanyModal(true)} */
              >
                <RefreshCw size={20} />
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
                {/* <th className="border-bottom">Logo</th> */}
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Responsable</th>
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Phone number</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => {
                const {
                  id,
                  CompanyName,
                  CompanyResponsable,
                  CompanyEmail,
                  PhoneNumber,
                } = company;
                return (
                  <tr key={company.id}>
                    <td className="fw-normal">{id}</td>
                    <td>
                      <span className="fw-normal">{CompanyName}</span>
                    </td>
                    <td>
                      <span className="fw-normal">{CompanyResponsable}</span>
                    </td>
                    <td>
                      <span className="fw-normal">{CompanyEmail}</span>
                    </td>
                    <td>
                      <span className="fw-normal">{PhoneNumber}</span>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View company in details</Tooltip>}
                      >
                        <button
                          className="btn btn-warning p-2 ms-2"
                          onClick={() => handleShowViewCompanyModal(company)}
                        >
                          <FontAwesomeIcon icon={faEye} className="icon-dark" />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update company</Tooltip>}
                      >
                        <button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateCompanyModal(id)}
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
                        overlay={<Tooltip>Delete company</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteCompanyModal(id)}
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
                        key={pagesNumber.indexOf(pageNumber)}
                        active
                      >
                        {" "}
                        {pageNumber}{" "}
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
              Showing <b>{companies.length}</b> out of
              <b>{" " + companiesNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      {/* ------------------------------------------------------------------------ */}
      <CreateCompanyModal
        showCreateCompanyModal={showCreateCompanyModal}
        setShowCreateCompanyModal={setShowCreateCompanyModal}
        setShowCreateCompanyToast={setShowCreateCompanyToast}
      />
      {/* Create company notification */}
      <CreateCompanyToast
        showCreateCompanyToast={showCreateCompanyToast}
        setShowCreateCompanyToast={setShowCreateCompanyToast}
      />
      {/* ------------------------------------------------------------------------ */}
      <ViewCompanyModal
        showViewCompanyModal={showViewCompanyModal}
        setShowViewCompanyModal={setShowViewCompanyModal}
        SelectedCompany={SelectedCompany}
      />
      {/* ------------------------------------------------------------------------ */}
      <DeleteCompanyModal
        showDeleteCompanyModal={showDeleteCompanyModal}
        setShowDeleteCompanyModal={setShowDeleteCompanyModal}
        setShowDeleteCompanyToast={setShowDeleteCompanyToast}
        SelectedCompany={SelectedCompany}
      />
      <DeleteCompanyToast
        showDeleteCompanyToast={showDeleteCompanyToast}
        setShowDeleteCompanyToast={setShowDeleteCompanyToast}
      />
      {/* ------------------------------------------------------------------------ */}
      <UpdateCompanyModal
        showUpdateCompanyModal={showUpdateCompanyModal}
        setShowUpdateCompanyModal={setShowUpdateCompanyModal}
        setShowUpdateCompanyToast={setShowUpdateCompanyToast}
        SelectedCompany={SelectedCompany}
      />
      <UpdateCompanyToast
        setShowUpdateCompanyToast={setShowUpdateCompanyToast}
        showUpdateCompanyToast={showUpdateCompanyToast}
      />
    </>
  );
}

export default CompaniesContent;

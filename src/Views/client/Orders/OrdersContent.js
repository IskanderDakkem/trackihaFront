import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
//--------------------------------------------------------------
import { RefreshCw } from "react-feather";
//--------------------------------------------------------------
import timer from "../../../assets/img/notification/timer.png";
import mail from "../../../assets/img/notification/mail.png";
import airMail from "../../../assets/img/notification/air-mail.png";
//--------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
//--------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faEye,
  faTrashAlt,
  faTruck,
  faClock,
  faPlus,
  faBan,
  faEnvelope,
  faEllipsisH,
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
  Dropdown,
} from "@themesberg/react-bootstrap";
//--------------------------------------------------------------
import CreateOrderModal from "./Modals/CreateOrderModal";
import CreateOrderToast from "./Toasts/CreateOrderToast";
//--------------------------------------------------------------
import ViewOrderModal from "./Modals/ViewOrderModal";
//--------------------------------------------------------------
import DeleteOrderModal from "./Modals/DeleteOrderModal";
import DeleteOrderToast from "./Toasts/DeleteOrderToast";
//--------------------------------------------------------------
import UpdateOrderModal from "./Modals/UpdateOrderModal";
import UpdateOrderToast from "./Toasts/UpdateOrderToast";
//--------------------------------------------------------------
import SendSuiviEmailModal from "./EmailsModal/SendSuiviEmailModal";
//--------------------------------------------------------------
import DeliverOrderModal from "./EmailsModal/DeliverOrderModal";
import DeliverOrderToast from "./Toasts/DeliverOrderToast";
//--------------------------------------------------------------
import SendIsLateModal from "./EmailsModal/SendIsLateModal";
//--------------------------------------------------------------
import SuiviToast from "./Toasts/SuiviToast";
//--------------------------------------------------------------
import CancelOrderModal from "./EmailsModal/CancelOrderModal";
//--------------------------------------------------------------
import SendEmailModal from "./EmailsModal/SendEmailModal";
//--------------------------------------------------------------
function OrdersContent({ clientId }) {
  const { Auth, setAuth, paginationNumber } = useAuth();
  let Token = localStorage.getItem("Token");
  let searchedId = Auth;
  if (clientId) {
    searchedId = clientId;
  }
  const navigate = useHistory();
  //--------------------------------------------------------------
  const [Orders, setOrders] = useState([]); //Getting the Orders
  const [rowPerPage, setRowPerPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(paginationNumber);
  const [OrdersNumber, setOrdersNumber] = useState(0);
  //--------------------------------------------------------------
  let pagesNumber = [];
  for (let i = 1; i < OrdersNumber / limitPerPage + 1; i++) {
    pagesNumber.push(i);
  }
  //--------------------------------------------------------------
  const getCLientOrders = async () => {
    await axios
      .get(
        ApiLinks.Orders.getUserOrders +
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
          setOrders((prev) => [...res?.data?.items]);
          setOrdersNumber((prev) => res?.data?.count);
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
    getCLientOrders();
  };
  const prevPage = (pageNumber) => {
    if (pageNumber !== 1) {
      setRowPerPage((prev) => prev - 1);
    }
  };
  const nextPage = (pageNumber) => {
    if (pageNumber < OrdersNumber / limitPerPage) {
      setRowPerPage((prev) => prev + 1);
    }
  };
  //---------------------------------------------------------------------
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false); //Create
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false); //Delete
  const [showUpdateOrderModal, setShowUpdateOrderModal] = useState(false); //Update
  const [showViewOrderModal, setShowViewOrderModal] = useState(false); //View
  //---------------------------------------------------------------------
  const [showCreateOrderToast, setShowCreateOrderToast] = useState(false); //Create
  const [showDeleteOrderToast, setShowDeleteOrderToast] = useState(false); //Delete
  const [showUpdateOrderToast, setShowUpdateOrderToast] = useState(false); //Update
  const [showSendEmailModal, setShowSendEmaiModal] = useState(false); //Send
  //---------------------------------------------------------------------
  const [sendSuiviEmailModal, setSendSuiviEmailModal] = useState(false);
  const [sendIsLateModal, setSendIsLateModal] = useState(false);
  const [sendIsDeliveredModal, setSendIsDeliveredModal] = useState(false);
  const [cancelOrder, setCancelOrderModal] = useState(false);
  //---------------------------------------------------------------------
  const [sendSuiviEmailToast, setSendSuiviEmailToast] = useState(false);
  const [sendIsLateEmailToast, setSendIsLateEmailToast] = useState(false);
  const [sendIsDeliveredToast, setSendIsDeliveredToast] = useState(false);
  const [cancelOrderToast, setCancelOrderToast] = useState(false);
  //---------------------------------------------------------------------

  useEffect(() => {
    if (searchedId !== null && searchedId !== undefined && searchedId !== 0) {
      getCLientOrders();
    }
  }, [
    rowPerPage, // ** when pagination is triggered
    showDeleteOrderToast, // ** order deleted
    showUpdateOrderToast, // ** order updated
    showCreateOrderToast, // ** order created
    showCreateOrderModal, // ** order created
    showDeleteOrderModal, // ** order deleted
    showUpdateOrderModal, // ** order updated
    showViewOrderModal, // ** view order
    sendSuiviEmailModal, // ** suivi
    sendIsLateModal, // ** late
    sendIsDeliveredModal, // ** delivered
    cancelOrder, // ** canceled
  ]);
  //---------------------------------------------------------------------
  const [selectedOrder, setSelectedOrder] = useState(0);
  //---------------------------------------------------------------------
  const handleShowViewOrderModal = (company) => {
    setShowViewOrderModal(true);
    setSelectedOrder((prev) => company);
  };
  const handleDeleteOrderModal = (id) => {
    setShowDeleteOrderModal(true);
    setSelectedOrder((prev) => id);
  };
  const handleUpdateOrderModal = (id) => {
    setShowUpdateOrderModal(true);
    setSelectedOrder((prev) => id);
  };
  //---------------------------------------------------------------------
  const handleSendEmailModal = (order) => {
    setShowSendEmaiModal(true);
    setSelectedOrder((prev) => order);
  };
  const handleSendIsLateModal = (companyId) => {
    setSendIsLateModal(true);
    setSelectedOrder(companyId);
  };
  /* const handleIsFollowedEmail = (companyId) => {
    setSendSuiviEmailModal(true);
    setSelectedOrder(companyId);
  }; */
  const handleDeliverOrder = (id) => {
    setSendIsDeliveredModal(true);
    setSelectedOrder((prev) => id);
  };
  const handleCancelOrder = (id) => {
    setCancelOrderModal(true);
    setSelectedOrder((prev) => id);
  };
  //--------------------------------------------------------------------
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
              <Button onClick={getCLientOrders} className="btn btn-primary">
                <RefreshCw size={20} />
              </Button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Create a new order</Tooltip>}
            >
              <Button
                className="btn btn-primary"
                onClick={() => setShowCreateOrderModal(true)}
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
                <th className="border-bottom">Company</th>
                <th className="border-bottom">Tracking N°</th>
                <th className="border-bottom">Est Date</th>
                <th className="border-bottom">Delivery Date</th>
                <th className="border-bottom">State</th>
                <th className="border-bottom">Notification</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map((order) => {
                const {
                  id,
                  companyName,
                  trackingCode,
                  estimatedDeliveryDate,
                  deliveryDate,
                  sequenceId,
                  isNotifiable,
                  isRetarded,
                  isLivraison,
                  state,
                  IsCancel,
                  /* crmLink,
                  deliveryCompanyLink, */
                } = order;

                const orderNotification = {
                  src: "",
                  grayScale: "",
                  toolTip: "",
                };
                if (isNotifiable === false) {
                  orderNotification.src = mail;
                  orderNotification.grayScale = 1;
                  orderNotification.toolTip =
                    "Won't receive a notification email";
                }
                if (isNotifiable === true) {
                  orderNotification.src = mail;
                  orderNotification.grayScale = 0;
                  orderNotification.toolTip = "Following email has been sent";
                }
                if (isRetarded === true) {
                  orderNotification.src = timer;
                  orderNotification.grayScale = 0;
                  orderNotification.toolTip = "This order is late";
                }
                if (isLivraison === true) {
                  orderNotification.src = airMail;
                  orderNotification.grayScale = 0;
                  orderNotification.toolTip = "This order has been delivered";
                }
                return (
                  <tr key={id}>
                    <td className="fw-normal">{id}</td>
                    <td className="fw-normal w-100">
                      <span className="fw-normal w-100">{companyName}</span>
                    </td>
                    <td>
                      <Link
                        to={`/order/track/${trackingCode}`}
                        target={"_blank"}
                        rel="noopener noreferrer"
                        className="link-info text-decoration-underline"
                      >
                        {trackingCode}
                        {/* <span className="fw-normal w-100 "></span> */}
                      </Link>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={
                          <Tooltip>
                            The estimated date the order will be delivered
                          </Tooltip>
                        }
                      >
                        <span className="fw-normal">
                          {new Date(estimatedDeliveryDate).toDateString()}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td className="text-center">
                      {deliveryDate === null ? (
                        IsCancel ? (
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={
                              <Tooltip>This order has been canceled</Tooltip>
                            }
                          >
                            <span className="text-danger text-capitalize">
                              {"Order canceled"}
                            </span>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={
                              <Tooltip>This order is not delivered yet</Tooltip>
                            }
                          >
                            <span className="text-info text-capitalize">
                              {"Not yet"}
                            </span>
                          </OverlayTrigger>
                        )
                      ) : (
                        <OverlayTrigger
                          placement="bottom"
                          trigger={["hover", "focus"]}
                          overlay={
                            <Tooltip>
                              This order has been delivered on{" "}
                              {new Date(deliveryDate).toDateString()}
                            </Tooltip>
                          }
                        >
                          <span className="alert alert-success">
                            {new Date(deliveryDate).toDateString()}
                          </span>
                        </OverlayTrigger>
                      )}
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Current order step</Tooltip>}
                      >
                        <span className="alert alert-info">
                          <span className="fw-normal">{state}</span>
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>{orderNotification.toolTip}</Tooltip>}
                      >
                        <Image
                          src={orderNotification.src}
                          style={{
                            height: "35px",
                            filter: `grayscale(${orderNotification.grayScale})`,
                            padding: "5px 0 0 30px",
                          }}
                        />
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View this order</Tooltip>}
                      >
                        <Button
                          className="btn btn-warning p-2 ms-1 ms-2"
                          onClick={() => handleShowViewOrderModal(id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="icon-dark" />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update the order</Tooltip>}
                      >
                        <Button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateOrderModal(id)}
                          disabled={isLivraison || IsCancel ? true : false}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="icon-dark"
                          />
                        </Button>
                      </OverlayTrigger>
                      {/* Drop down starts */}
                      <Dropdown
                        /* as={Button} */
                        className="btn btn-primary p-2 ms-2"
                        rootcloseevent="mousedown"
                      >
                        <Dropdown.Toggle
                          /* as={Button} */
                          split
                          variant="link"
                          className="text-white m-0 p-0"
                        >
                          <span className="icon icon-sm">
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-light"
                            />
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Cancel this order</Tooltip>}
                          >
                            <Dropdown.Item
                              disabled={IsCancel || isLivraison ? true : false}
                              onClick={() => handleCancelOrder(id)}
                              className="btn-danger p-2 text-danger"
                              as="button"
                            >
                              <FontAwesomeIcon
                                icon={faBan}
                                className="icon-dark"
                              />{" "}
                              Cancel this order
                            </Dropdown.Item>
                          </OverlayTrigger>
                          {/* delete order section */}
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Delete the order</Tooltip>}
                          >
                            <Dropdown.Item
                              className="btn-danger text-danger p-2"
                              /* as="button" */
                              onClick={() => handleDeleteOrderModal(id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="icon-dark"
                              />{" "}
                              Delete this order
                            </Dropdown.Item>
                          </OverlayTrigger>
                          {/* end of delete order section */}
                          {/* set order to be late */}
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={
                              <Tooltip>Update this order to be late</Tooltip>
                            }
                          >
                            <Dropdown.Item
                              /* as="button" */
                              disabled={
                                isRetarded || isLivraison || IsCancel
                                  ? true
                                  : false
                              }
                              className="btn-warning p-2"
                              onClick={() => handleSendIsLateModal(id)}
                            >
                              <FontAwesomeIcon
                                icon={faClock}
                                className="icon-dark"
                              />{" "}
                              Set order late
                            </Dropdown.Item>
                          </OverlayTrigger>
                          {/* {crmLink && ( */}
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>View this order CRM</Tooltip>}
                          >
                            <Dropdown.Item
                              /* as="button" */
                              className="btn-warning p-2"
                            >
                              <FontAwesomeIcon
                                icon={faTruck}
                                className="icon-dark"
                              />{" "}
                              View CRM
                            </Dropdown.Item>
                          </OverlayTrigger>
                          {/* )} */}
                          {/* {deliveryCompanyLink && ( */}
                          <OverlayTrigger
                            placement="bottom"
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>View this order hubspot</Tooltip>}
                          >
                            <Dropdown.Item
                              /* as="button" */
                              className="btn-warning p-2"
                            >
                              <FontAwesomeIcon
                                icon={faTruck}
                                className="icon-dark"
                              />{" "}
                              View Logistics
                            </Dropdown.Item>
                          </OverlayTrigger>
                          {/*  )} */}
                          {/* end of set order to be late */}
                        </Dropdown.Menu>
                      </Dropdown>
                      {/* End of dropdown */}
                      {/* <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Delete the order</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteOrderModal(id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="icon-dark"
                          />
                        </button>
                      </OverlayTrigger> */}
                      {/* <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Cancel the order</Tooltip>}
                      >
                        <Button
                          disabled={IsCancel || isLivraison ? true : false}
                          onClick={() => handleCancelOrder(id)}
                          className="btn btn-danger p-2 ms-2"
                        >
                          <FontAwesomeIcon icon={faBan} className="icon-dark" />
                        </Button>
                      </OverlayTrigger> */}

                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Emails sent</Tooltip>}
                      >
                        <Button
                          className="btn btn-info p-2 ms-2"
                          onClick={() => handleSendEmailModal(order)}
                        >
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="icon-dark"
                          />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={
                          <Tooltip>update order to be delivered</Tooltip>
                        }
                      >
                        <Button
                          disabled={isLivraison || IsCancel ? true : false}
                          className="btn btn-info p-2 ms-2"
                          onClick={() =>
                            handleDeliverOrder({ orderId: id, sequenceId })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTruck}
                            className="icon-dark"
                          />
                        </Button>
                      </OverlayTrigger>
                      {/* <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update order to be late</Tooltip>}
                      >
                        <Button
                          disabled={
                            isRetarded || isLivraison || IsCancel ? true : false
                          }
                          className="btn btn-warning p-2 ms-2"
                          onClick={() => handleSendIsLateModal(id)}
                        >
                          <FontAwesomeIcon
                            icon={faClock}
                            className="icon-dark"
                          />
                        </Button>
                      </OverlayTrigger> */}
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
              Showing <b>{Orders.length}</b> out of
              <b>{" " + OrdersNumber + " "}</b>
              entries
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
      {/* ------------------------------------------------------------------------ */}
      <CreateOrderModal
        showCreateOrderModal={showCreateOrderModal}
        setShowCreateOrderModal={setShowCreateOrderModal}
        setShowCreateOrderToast={setShowCreateOrderToast}
      />
      {/* Create company notification */}
      <CreateOrderToast
        showCreateOrderToast={showCreateOrderToast}
        setShowCreateOrderToast={setShowCreateOrderToast}
      />
      {/* ------------------------------------------------------------------------ */}
      <ViewOrderModal
        showViewOrderModal={showViewOrderModal}
        setShowViewOrderModal={setShowViewOrderModal}
        selectedOrder={selectedOrder}
      />
      {/* ------------------------------------------------------------------------ */}
      <DeleteOrderModal
        showDeleteOrderModal={showDeleteOrderModal}
        setShowDeleteOrderModal={setShowDeleteOrderModal}
        setShowDeleteOrderToast={setShowDeleteOrderToast}
        selectedOrder={selectedOrder}
      />
      <DeleteOrderToast
        showDeleteOrderToast={showDeleteOrderToast}
        setShowDeleteOrderToast={setShowDeleteOrderToast}
      />
      {/* ------------------------------------------------------------------------ */}
      <UpdateOrderModal
        showUpdateOrderModal={showUpdateOrderModal}
        setShowUpdateOrderModal={setShowUpdateOrderModal}
        setShowUpdateOrderToast={setShowUpdateOrderToast}
        selectedOrder={selectedOrder}
      />
      <UpdateOrderToast
        setShowUpdateOrderToast={setShowUpdateOrderToast}
        showUpdateOrderToast={showUpdateOrderToast}
      />
      {/* ------------------------------------------------------------------------ */}
      {/* delivery order modal */}
      <SendEmailModal
        showSendEmailModal={showSendEmailModal}
        setShowSendEmaiModal={setShowSendEmaiModal}
        setSendSuiviEmailToast={setSendSuiviEmailToast}
        setSendIsLateEmailToast={setSendIsLateEmailToast}
        setSendIsDeliveredToast={setSendIsDeliveredToast}
        selectedOrder={selectedOrder}
      />
      {/* ------------------------------------------------------------------------ */}
      {/* delivery order modal */}
      <DeliverOrderModal
        setSendIsDeliveredToast={setSendIsDeliveredToast}
        sendIsDeliveredModal={sendIsDeliveredModal}
        setSendIsDeliveredModal={setSendIsDeliveredModal}
        selectedOrder={selectedOrder}
      />
      <DeliverOrderToast
        sendIsDeliveredToast={sendIsDeliveredToast}
        setSendIsDeliveredToast={setSendIsDeliveredToast}
      />
      {/* ------------------------------------------------------------------------ */}
      {/* send suivi email modal */}
      <SendSuiviEmailModal
        sendSuiviEmailModal={sendSuiviEmailModal}
        setSendSuiviEmailModal={setSendSuiviEmailModal}
        setSendSuiviEmailToast={setSendSuiviEmailToast}
        selectedOrder={selectedOrder}
      />
      {/* send late email */}
      <SendIsLateModal
        sendIsLateModal={sendIsLateModal}
        setSendIsLateModal={setSendIsLateModal}
        setSendIsLateEmailToast={setSendIsLateEmailToast}
        selectedOrder={selectedOrder}
      />
      {/* ------------------------------------------------------------------------ */}
      <SuiviToast
        sendSuiviEmailToast={sendSuiviEmailToast}
        setSendSuiviEmailToast={setSendSuiviEmailToast}
      />
      <CancelOrderModal
        cancelOrder={cancelOrder}
        setCancelOrderModal={setCancelOrderModal}
        setCancelOrderToast={setCancelOrderToast}
        selectedOrder={selectedOrder}
      />
    </>
  );
}

export default OrdersContent;

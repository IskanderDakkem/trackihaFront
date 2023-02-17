import React from "react";
import { useState, useEffect } from "react";
//----------------------------------------------------------------------------
import { Col, Modal, Button, Form } from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
import axios from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
//----------------------------------------------------------------------------
function ViewOrderModal({
  setShowViewOrderModal,
  showViewOrderModal,
  selectedOrder,
}) {
  const Token = localStorage.getItem("Token");
  //-----------------------------------------------------------------
  const [newOrder, setOrder] = useState({});
  const getOrder = async () => {
    await axios
      .get(ApiLinks.Orders.getOne + selectedOrder, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setOrder((prev) => ({ ...res?.data }));
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };
  useEffect(() => {
    if (
      showViewOrderModal &&
      selectedOrder !== null &&
      selectedOrder !== undefined &&
      selectedOrder !== 0
    ) {
      getOrder();
    }
  }, [showViewOrderModal]);
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showViewOrderModal}
      onHide={() => setShowViewOrderModal(false)}
    >
      <Modal.Header>
        <Button
          variant="close"
          aria-label="Close"
          onClick={() => setShowViewOrderModal(false)}
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4">View order</h5>
        <Form>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Status: </Form.Label>&nbsp;
              {newOrder?.Order?.deliveryDate === null ? (
                newOrder?.Order?.IsCancel ? (
                  <span className="text-danger">Order is canceled</span>
                ) : (
                  <span className="text-info">Order is not delivered yet</span>
                )
              ) : (
                <span className="text-success">Delivered</span>
              )}
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Order id:</Form.Label>&nbsp; &nbsp;
              <span className="text-info">{newOrder?.Order?.id}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Tracking code: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{newOrder?.Order?.trackingCode}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company name: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">
                {newOrder?.Company?.CompanyName}
              </span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Responsable name: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">
                {newOrder?.Company?.CompanyResponsable}
              </span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Estimated delivery date: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">
                {new Date(
                  newOrder?.Order?.estimatedDeliveryDate
                ).toDateString()}
              </span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Delivery date: </Form.Label>&nbsp; &nbsp;
              {newOrder?.Order?.deliveryDate === null ? (
                <span className="text-info">Not Yet</span>
              ) : (
                <span className="text-success">
                  {new Date(newOrder?.Order?.deliveryDate).toDateString()}
                </span>
              )}
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Selected sequence: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{newOrder?.Sequence?.name}</span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Step: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">{newOrder?.Order?.state}</span>
            </Form.Group>
          </Col>
          {newOrder?.Order?.deliveryCompanyLink && (
            <Col className="mb-3">
              <Form.Group>
                <Form.Label>Logistics link: </Form.Label>&nbsp; &nbsp;
                <span className="text-info">
                  {newOrder?.Order?.deliveryCompanyLink}
                </span>
              </Form.Group>
            </Col>
          )}
          {newOrder?.Order?.deliveryCompanyId > 0 && (
            <Col className="mb-3">
              <Form.Group>
                <Form.Label>Logistics ID: </Form.Label>&nbsp; &nbsp;
                <span className="text-info">
                  {newOrder?.Order?.deliveryCompanyId}
                </span>
              </Form.Group>
            </Col>
          )}
          {newOrder?.Order?.crmLink && (
            <Col className="mb-3">
              <Form.Group>
                <Form.Label>CRM ID: </Form.Label>&nbsp; &nbsp;
                <span className="text-info">{newOrder?.Order?.crmLink}</span>
              </Form.Group>
            </Col>
          )}
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Created At: </Form.Label>&nbsp; &nbsp;
              <span className="text-info">
                {new Date(newOrder?.Order?.createdAt).toDateString()}
              </span>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Last update at: </Form.Label>&nbsp; &nbsp;
              {newOrder?.Order?.updatedAt === null ? (
                <span className="text-info">Not updates has been made</span>
              ) : (
                <span className="text-info">
                  {new Date(newOrder?.Order?.updatedAt).toDateString()}
                </span>
              )}
            </Form.Group>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ViewOrderModal;

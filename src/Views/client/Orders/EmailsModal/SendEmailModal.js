// ** react imports
import React from "react";
// ** bootstrap imports
import { Table, Modal, Button } from "@themesberg/react-bootstrap";
//----------------------------------------------------------------------------
function SendEmailModal({
  showSendEmailModal,
  setShowSendEmaiModal,
  selectedOrder,
}) {
  const onHide = () => {
    setShowSendEmaiModal(false);
  };
  // ** ==>
  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showSendEmailModal}
      onHide={onHide}
      className="w-100"
    >
      <Modal.Header>
        <Button variant="close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-4 text-capitalize">Email status</h5>
        <Table responsive>
          <thead>
            <tr>
              <th className="border-bottom">Type</th>
              <th className="border-bottom">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Follow Up Email</td>
              <td>
                {selectedOrder.isNotifiable ? (
                  <span className="alert alert-success">
                    <span className="fw-normal">Sent</span>
                  </span>
                ) : (
                  <span className="alert alert-warning">
                    <span className="fw-normal">Not Sent</span>
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>The order is late</td>
              <td>
                {selectedOrder.isRetarded ? (
                  <span className="alert alert-success">
                    <span className="fw-normal">Sent</span>
                  </span>
                ) : (
                  <span className="alert alert-warning">
                    <span className="fw-normal">Not Sent</span>
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>The order is delivered</td>
              <td>
                {selectedOrder.isLivraison ? (
                  <span className="alert alert-success">
                    <span className="fw-normal">Sent</span>
                  </span>
                ) : (
                  <span className="alert alert-warning">
                    <span className="fw-normal">Not Sent</span>
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>The order is canceled</td>
              <td>
                {selectedOrder.IsCancel ? (
                  <span className="alert alert-success">
                    <span className="fw-normal">Sent</span>
                  </span>
                ) : (
                  <span className="alert alert-warning">
                    <span className="fw-normal">Not Sent</span>
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default SendEmailModal;

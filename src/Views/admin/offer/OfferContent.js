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
  faEye,
  faTrashAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Table,
  Form,
  InputGroup,
  Tooltip,
  OverlayTrigger,
} from "@themesberg/react-bootstrap";
import CreateOfferModal from "./Modal/CreateOfferModal";
import DeleteOfferModal from "./Modal/DeleteOfferModal";
import ViewOfferModal from "./Modal/ViewOfferModal";
import UpdateOfferModal from "./Modal/UpdateOfferModal";
//--------------------------------------------------------------
function OfferContent() {
  const Token = localStorage.getItem("Token");
  const navigate = useHistory();
  //--------------------------------------------------------------
  const [offers, setOffers] = useState([]);
  //--------------------------------------------------------------
  const getAllOffers = async () => {
    await axios
      .get(ApiLinks.offers.getAll, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setOffers((prev) => res?.data?.items);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
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
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showDeleteOfferModal, setShowDeleteOfferModal] = useState(false);
  const [showUpdateOfferModal, setShowUpdateOfferModal] = useState(false);
  const [showViewOfferModal, setShowViewOfferModal] = useState(false);
  //--------------------------------------------------------------
  useEffect(() => {
    getAllOffers();
  }, [
    showCreateOfferModal,
    showDeleteOfferModal,
    showUpdateOfferModal,
    showViewOfferModal,
  ]);
  //--------------------------------------------------------------
  const [selectedOffer, setSelectedOffer] = useState(0);
  //---------------------------------------------------------------------
  const handleShowViewOffer = (id) => {
    setShowViewOfferModal(true);
    setSelectedOffer((prev) => id);
  };
  const handleDeleteOffer = (id) => {
    setShowDeleteOfferModal(true);
    setSelectedOffer((prev) => id);
  };
  const handleUpdateOffer = (id) => {
    setShowUpdateOfferModal(true);
    setSelectedOffer((prev) => id);
  };
  //--------------------------------------------------------------
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
              <button onClick={getAllOffers} className="btn btn-primary">
                refresh
              </button>
            </OverlayTrigger>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Create a new offer</Tooltip>}
            >
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateOfferModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="icon-dark" />
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
                <th className="border-bottom ">#</th>
                <th className="border-bottom ">Name</th>
                <th className="border-bottom ">Number of companies</th>
                <th className="border-bottom ">Number of orders</th>
                <th className="border-bottom ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                const { id, name, companies, orders } = offer;
                return (
                  <tr key={id}>
                    <td className="fw-norma">{id}</td>
                    <td>
                      <span className="fw-normal">{name}</span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {companies === parseInt(-1) ? "infinity" : companies}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {orders === parseInt(-1) ? "infinity" : orders}
                      </span>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>View the offer</Tooltip>}
                      >
                        <button
                          className="btn btn-warning p-2 ms-2"
                          onClick={() => handleShowViewOffer(id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="icon-dark" />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>Update this offer</Tooltip>}
                      >
                        <button
                          className="btn btn-success p-2 ms-2"
                          onClick={() => handleUpdateOffer(id)}
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
                        overlay={<Tooltip>Delete this offer</Tooltip>}
                      >
                        <button
                          className="btn btn-danger p-2 ms-2"
                          onClick={() => handleDeleteOffer(id)}
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
        </Card.Body>
      </Card>
      <CreateOfferModal
        showCreateOfferModal={showCreateOfferModal}
        setShowCreateOfferModal={setShowCreateOfferModal}
      />
      <DeleteOfferModal
        showDeleteOfferModal={showDeleteOfferModal}
        setShowDeleteOfferModal={setShowDeleteOfferModal}
        selectedOffer={selectedOffer}
      />
      <ViewOfferModal
        showViewOfferModal={showViewOfferModal}
        setShowViewOfferModal={setShowViewOfferModal}
        selectedOffer={selectedOffer}
      />
      <UpdateOfferModal
        showUpdateOfferModal={showUpdateOfferModal}
        setShowUpdateOfferModal={setShowUpdateOfferModal}
        selectedOffer={selectedOffer}
      />
    </>
  );
}

export default OfferContent;

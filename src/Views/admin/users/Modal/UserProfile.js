import React, { useState, useEffect } from "react";
//---------------------------------------------------------------------
import {
  Col,
  Form,
  InputGroup,
  Card,
  Image,
} from "@themesberg/react-bootstrap";
import Profile3 from "../../../../assets/img/team/profile-picture-3.jpg";
import axios, { BASE_PATH } from "../../../../Context/Axios";
import ApiLinks from "../../../../Context/ApiLinks";
//---------------------------------------------------------------------
function UserProfile({ profile }) {
  let accountState = {};
  if (profile?.suspended === true) {
    accountState.content = "suspended";
    accountState.cssClass = "text-danger";
  } else {
    accountState.content = "active";
    accountState.cssClass = "text-success";
  }
  return (
    <div className="table-settings mb-4">
      {/* <h5 className="mb-4">View user</h5> */}
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-4">
          <Col className="mb-3">
            <div className="d-xl-flex align-items-center">
              <div className="user-avatar xl-avatar">
                <Image
                  fluid
                  rounded
                  src={
                    profile?.avatar === null ||
                    profile?.avatar === undefined ||
                    profile?.avatar === ""
                      ? Profile3
                      : BASE_PATH + profile?.avatar
                  }
                />
              </div>
            </div>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Account state</Form.Label>
              <InputGroup>
                <Form.Control
                  className={accountState.cssClass}
                  disabled
                  value={`Account is ${accountState.content}`}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <Form.Control disabled value={profile?.CompanyName} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Responsable Name</Form.Label>
              <InputGroup>
                <Form.Control disabled value={profile?.ResponsableName} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control disabled value={profile?.Email} />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group id="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control disabled value={profile?.Tel} />
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Selected offer</Form.Label>
              <Form.Control disabled value={profile?.OfferName} />
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Number of companies allowed</Form.Label>
              <Form.Control disabled value={profile?.companiesNumberAllowed} />
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Number of orders allowed</Form.Label>
              <Form.Control disabled value={profile?.OrdersNumberAllowed} />
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Number of companies created</Form.Label>
              <Form.Control disabled value={profile?.companiesCreated} />
            </Form.Group>
          </Col>
          <Col className="mb-3">
            <Form.Group>
              <Form.Label>Created At</Form.Label>
              <Form.Control disabled value={profile?.createdAt} />
            </Form.Group>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserProfile;

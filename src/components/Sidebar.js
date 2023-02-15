import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
//------------------------------------------------------------------
import SimpleBar from "simplebar-react";
import { CSSTransition } from "react-transition-group";
//------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faCog,
  faHandHoldingUsd,
  faSignOutAlt,
  faTimes,
  faBuilding,
  faList,
  faProjectDiagram,
} from "@fortawesome/free-solid-svg-icons";
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Navbar,
} from "@themesberg/react-bootstrap";
//------------------------------------------------------------------
import { Routes } from "../Context/routes";
import ApiLinks from "../Context/ApiLinks";
import axios from "../Context/Axios";
import useAuth from "./../Context/useAuth";
import { BASE_PATH } from "../Context/Axios";
//------------------------------------------------------------------
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
//------------------------------------------------------------------
export default (props = {}) => {
  const { setAuth, profile } = useAuth();
  const history = useHistory();
  const location = useLocation();
  //-------------------------------------------------------------------------
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("Token");
    history.push(Routes.Signin.path);
  };
  const { pathname } = location;
  //-------------------------------------------------------------------------
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const onCollapse = () => setShow(!show);
  /* const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";
    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button
            as={Nav.Link}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }; */
  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };
    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };
  return (
    <>
      {/*Navbar beginning */}
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.Home.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      {/*Navbar End */}
      {/*Applying amination */}
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        {/* Sidebar start */}
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={
                      profile?.avatar?.length === 0
                        ? ProfilePicture
                        : BASE_PATH + profile?.avatar
                    }
                    className="card-img-top rounded-circle border-white"
                  />
                </div>
                <div className="d-block">
                  <h6>Hi, {profile?.ResponsableName}</h6>
                  <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    to={Routes.Signin.path}
                    className="text-dark"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="me-2"
                      onClick={logout}
                    />
                    Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem
                title="Trakiha"
                link={Routes.Presentation.path}
                image={ReactHero}
              />

              <NavItem
                title="Dashboard"
                link={Routes.Home.path}
                icon={faChartPie}
              />
              <NavItem
                title="Orders"
                icon={faHandHoldingUsd}
                link={Routes.Transactions.path}
              />
              <NavItem
                title="Companies"
                icon={faBuilding}
                link={Routes.Companies.path}
              />
              <NavItem
                title="Sequences"
                icon={faProjectDiagram}
                link={Routes.Sequences.path}
              />
              <NavItem title="Steps" icon={faList} link={Routes.Steps.path} />

              {/* Seconde sidebar part*/}
              <Dropdown.Divider className="my-3 border-indigo" />
              <NavItem
                title="Settings"
                icon={faCog}
                link={Routes.Settings.path}
              />
            </Nav>
          </div>
        </SimpleBar>
        {/*End of Side bar */}
      </CSSTransition>
      {/*End of Applying amination */}
    </>
  );
};

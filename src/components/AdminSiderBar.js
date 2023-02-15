import React, { useState /* , useEffect */ } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
//------------------------------------------------------------------
import SimpleBar from "simplebar-react";
import { CSSTransition } from "react-transition-group";
//------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faSignOutAlt,
  faTimes,
  faUser,
  faGift,
  faIcons,
  faWindowClose,
  faTruck,
  faDesktop,
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
import useAuth from "./../Context/useAuth";
//------------------------------------------------------------------
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
//------------------------------------------------------------------
export default (props = {}) => {
  const { setAuth } = useAuth();
  const location = useLocation();
  const history = useHistory();
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
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="d-block">
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
                /* link={Routes.PresentationAdmin.path} */
                image={ReactHero}
              />
              <NavItem
                title="Dashboard"
                link={Routes.HomeAdmin.path}
                icon={faChartPie}
              />
              <NavItem title="Offers" link={Routes.Offers.path} icon={faGift} />
              <NavItem
                title="Costumers"
                link={Routes.Users.path}
                icon={faUser}
              />
              <NavItem title="Icons" link={Routes.Icons.path} icon={faIcons} />
              <NavItem title="CRM" link={Routes.CRM.path} icon={faDesktop} />
              <NavItem
                title="Logistics"
                link={Routes.Hubspot.path}
                icon={faTruck}
              />
              <Dropdown.Divider className="my-3 border-indigo" />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

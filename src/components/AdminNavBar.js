import React from "react";
import { Link, useHistory } from "react-router-dom";
//-------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Nav,
  Image,
  Navbar,
  Dropdown,
  Container,
} from "@themesberg/react-bootstrap";
import Profile3 from "../assets/img/team/profile-picture-3.jpg";
//-------------------------------------------------------------------
import { Routes } from "../Context/routes";
import useAuth from "./../Context/useAuth";
import { BASE_PATH } from "../Context/Axios";
//-------------------------------------------------------------------
function AdminNavBar() {
  const history = useHistory();
  const { setAuth, profile } = useAuth();
  //-------------------------------------------------------------------
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("Token");
    history.push(Routes.Signin.path);
  };
  //-------------------------------------------------------------------
  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center"></div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image
                    src={
                      profile?.avatar?.length > 0
                        ? BASE_PATH + profile?.avatar
                        : Profile3
                    }
                    className="user-avatar md-avatar rounded-circle"
                  />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">
                      {profile?.ResponsableName}
                    </span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <>
                  <Dropdown.Item
                    className="fw-bold"
                    as={Link}
                    to={Routes.Settings.path}
                  >
                    <FontAwesomeIcon icon={faCog} className="me-2" /> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                </>
                <Dropdown.Item className="fw-bold" onClick={logout}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger me-2"
                  />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default AdminNavBar;

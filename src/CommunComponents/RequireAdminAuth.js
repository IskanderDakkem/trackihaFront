import React, { useState /*useEffect */ } from "react";
import { Route, Redirect } from "react-router-dom";
import { Routes } from "../Context/routes";
/* import ApiLinks from "./../Context/ApiLinks";
import axios from "./../Context/Axios"; */
//------------------------------------------------------------
function RequireAdminAuth({ children, ...rest }) {
  /* const Token = localStorage.getItem("Token"); */
  const [isAuth, setIsAuth] = useState(true);
  /* useEffect(() => {
    const validateAdmin = async () => {
      if (Token === null) {
        setIsAuth((prev) => false);
      }
      if (Token !== null) {
        await axios
          .post(
            ApiLinks.Admin.verifyAdmin,
            {},
            {
              headers: { authorization: "Bearer " + Token },
            }
          )
          .then((res) => {
            if (res?.status === 200) {
              setIsAuth(true);
              setIsAuth(false)
            }
            console.log(res);
          })
          .catch((err) => {
            setIsAuth(false);
          });
      }
    };
    validateAdmin();
  }, []); */
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isAuth === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: Routes.SigninAdmin.path,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}
//------------------------------------------------------------
export default RequireAdminAuth;

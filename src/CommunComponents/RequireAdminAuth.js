import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Routes } from "../Context/routes";
//------------------------------------------------------------
function RequireAdminAuth({ children, ...rest }) {
  const Token = localStorage.getItem("Token");
  // ** ==>
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return Token !== null ? (
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

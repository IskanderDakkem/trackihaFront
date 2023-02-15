import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import ApiLinks from "../Context/ApiLinks";
import { Routes } from "../Context/routes";
//------------------------------------------------------------
import useAuth from "../Context/useAuth";
import axios from "./../Context/Axios";
//------------------------------------------------------------
function RequireAuth({ children, ...rest }) {
  const navigate = useHistory();
  const { Auth, setAuth, setProfile } = useAuth(); // ** user id
  const Token = localStorage.getItem("Token"); // ** token
  const validateClient = async () => {
    await axios
      .get(ApiLinks.Auth.verifyUser, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          localStorage.setItem("Token", res?.data?.Token);
          setAuth((prev) => res?.data?.userId);
          setProfile({ ...res?.data?.profile });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        // 401
        if (error?.response?.status === 401) {
          setAuth(null);
        }
        // 403
        else if (error?.response?.status === 403) {
          setAuth(null);
        }
        // 500
        else if (error?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };
  useEffect(() => {
    validateClient();
  }, []);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return Auth !== null ? (
          children
        ) : (
          <Redirect
            to={{ pathname: Routes.Signin.path, state: { from: location } }}
          />
        );
      }}
    />
  );
}
//------------------------------------------------------------
export default RequireAuth;

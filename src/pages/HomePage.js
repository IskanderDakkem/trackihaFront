import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
//------------------------------------------------------------
import Preloader from "../components/Preloader";
//------------------------------------------------------------
// ** auth client
import Signin from "../Views/client/Auth/Signin"; //Keep
import Signup from "../Views/client/Auth/Signup"; //Keep
import ForgotPassword from "../Views/client/Auth/ForgotPassword"; //Keep
import ResetPassword from "../Views/client/Auth/ResetPassword"; //Keep
import CreatePassword from "../Views/client/Auth/CreatePassword";
// ** Catching errors
import Lock from "../Views/client/Auth/Lock"; //Keep
import ServerError from "../Views/client/Auth/ServerError"; //Keep
// ** client role
import Companies from "./client/Companies"; //Companies
import Dashboard from "./client/Dashboard"; //Dashboard
import Transactions from "./client/Orders"; //orders
import Sequences from "./client/Sequences";
import Steps from "./client/Steps"; //Steps
import Settings from "./client/Settings"; //Settings
// ** Admin auth
import SigninAdmin from "../Views/admin/auth/SigninAdmin";
// **  Admin role
//------------------------------------------------------------
import Icons from "../pages/admin/Icons";
import Offers from "./admin/Offers";
import Users from "./admin/Users";
import ViewUser from "../Views/admin/users/ViewUser";
import RequireAdminAuth from "./../CommunComponents/RequireAdminAuth";
import AdminDashboard from "./admin/AdminDashboard";
import CRM from "./admin/CRM";
import Hubspot from "./admin/Hubspot";
import TrackOrder from "../Views/TrackOrder";
// ** Api configs
import { Routes } from "../Context/routes";
import RequireAuth from "../CommunComponents/RequireAuth";
//------------------------------------------------------------
const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={loaded ? false : true} /> <Component {...props} />
        </>
      )}
    />
  );
};
//------------------------------------------------------------
function HomePage() {
  return (
    <Switch>
      {/* Client auth */}
      {/* -------------------------------------------------------------------------- */}
      <RouteWithLoader
        exact
        path={Routes.Presentation.path}
        component={Signin}
      />
      <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
      <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
      <RouteWithLoader
        exact
        path={Routes.ForgotPassword.path}
        component={ForgotPassword}
      />
      <RouteWithLoader
        exact
        path={Routes.ResetPassword.path}
        component={ResetPassword}
      />
      <RouteWithLoader
        exact
        path={Routes.CreatePassword.path}
        component={CreatePassword}
      />
      <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
      {/* Client role */}
      {/* -------------------------------------------------------------------------- */}
      <RequireAuth exact path={Routes.Home.path}>
        <Dashboard />
      </RequireAuth>
      <RequireAuth exact path={Routes.Companies.path}>
        <Companies />
      </RequireAuth>
      <RequireAuth exact path={Routes.Transactions.path}>
        <Transactions />
      </RequireAuth>
      <RequireAuth exact path={Routes.Sequences.path}>
        <Sequences />
      </RequireAuth>
      <RequireAuth exact path={Routes.Steps.path}>
        <Steps />
      </RequireAuth>
      <RequireAuth exact path={Routes.Settings.path}>
        <Settings />
      </RequireAuth>
      {/* Admin auth */}
      {/* -------------------------------------------------------------------------- */}
      <RouteWithLoader exact path={Routes.SigninAdmin.path}>
        <SigninAdmin />
      </RouteWithLoader>
      {/* Admin routes */}
      {/* -------------------------------------------------------------------------- */}
      <RequireAdminAuth exact path={Routes.HomeAdmin.path}>
        <AdminDashboard />
      </RequireAdminAuth>
      <RequireAdminAuth exact path={Routes.Icons.path}>
        <Icons />
      </RequireAdminAuth>
      <RequireAdminAuth exact path={Routes.Offers.path}>
        <Offers />
      </RequireAdminAuth>
      <RequireAdminAuth exact path={Routes.Users.path}>
        <Users />
      </RequireAdminAuth>
      <RequireAdminAuth exact path={Routes.UserContent.path}>
        <ViewUser />
      </RequireAdminAuth>
      <RequireAdminAuth exact path={Routes.CRM.path}>
        <CRM />
      </RequireAdminAuth>
      <RequireAdminAuth exact path={Routes.Hubspot.path}>
        <Hubspot />
      </RequireAdminAuth>
      {/* Tracking error */}
      {/* -------------------------------------------------------------------------- */}
      <RouteWithLoader exact path={`/order/track/:id`}>
        <TrackOrder />
      </RouteWithLoader>
      {/* -------------------------------------------------------------------------- */}
      {/* Catching Errors */}
      {/* -------------------------------------------------------------------------- */}
      <RouteWithLoader
        exact
        path={Routes.ServerError.path}
        component={ServerError}
      />
      {/* Redirect to */}
      {/* -------------------------------------------------------------------------- */}
      <Redirect to={Routes.NotFound.path} />
    </Switch>
  );
}
export default HomePage;

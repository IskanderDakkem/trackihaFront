import React from "react";
import RouteWithAdminSideBar from "./../../CommunComponents/RouteWithAdminSideBar";
import TableTitle from "./../../CommunComponents/TableTitle";
import UsersContent from "./../../Views/admin/users/UsersContent";

function Users() {
  return (
    <RouteWithAdminSideBar>
      <TableTitle title={"Users"} subTitle={"Users management."} />
      <UsersContent />
    </RouteWithAdminSideBar>
  );
}

export default Users;

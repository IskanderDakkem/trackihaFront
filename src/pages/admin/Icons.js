import React from "react";
//--------------------------------------------------------------------------------
import TableTitle from "../../CommunComponents/TableTitle";
import RouteWithAdminSideBar from "./../../CommunComponents/RouteWithAdminSideBar";
import IconsContent from "./../../Views/admin/icons/IconsContent";
//--------------------------------------------------------------------------------
function Icons() {
  return (
    <RouteWithAdminSideBar>
      <TableTitle title={"Icons"} subTitle={"Icons management."} />
      <IconsContent />
    </RouteWithAdminSideBar>
  );
}
//--------------------------------------------------------------------------------
export default Icons;

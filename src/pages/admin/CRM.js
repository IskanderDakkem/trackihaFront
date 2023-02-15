import React from "react";
import RouteWithAdminSideBar from "../../CommunComponents/RouteWithAdminSideBar";
import TableTitle from "../../CommunComponents/TableTitle";
import CrmContent from "./../../Views/admin/crm/CrmContent";

function CRM() {
  return (
    <RouteWithAdminSideBar>
      <TableTitle title={"CRM"} subTitle={"CRM management."} />
      <CrmContent />
    </RouteWithAdminSideBar>
  );
}

export default CRM;

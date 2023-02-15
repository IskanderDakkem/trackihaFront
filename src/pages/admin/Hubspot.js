import React from "react";
import RouteWithAdminSideBar from "../../CommunComponents/RouteWithAdminSideBar";
import TableTitle from "../../CommunComponents/TableTitle";
import HubspotContent from "./../../Views/admin/hubspot/HubspotContent";

function Hubspot() {
  return (
    <RouteWithAdminSideBar>
      <TableTitle title={"Logistics"} subTitle={"Logistics management."} />
      <HubspotContent />
    </RouteWithAdminSideBar>
  );
}

export default Hubspot;

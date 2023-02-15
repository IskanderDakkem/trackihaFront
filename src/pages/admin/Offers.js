import React from "react";
//--------------------------------------------------------------------------------
import TableTitle from "../../CommunComponents/TableTitle";
import RouteWithAdminSideBar from "./../../CommunComponents/RouteWithAdminSideBar";
import OfferContent from "./../../Views/admin/offer/OfferContent";
//--------------------------------------------------------------------------------
function Offers() {
  return (
    <RouteWithAdminSideBar>
      <TableTitle title={"Offers"} subTitle={"Offers management."} />
      <OfferContent />
    </RouteWithAdminSideBar>
  );
}
//--------------------------------------------------------------------------------
export default Offers;

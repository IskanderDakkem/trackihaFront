import React, { useEffect, useState } from "react";
import AdminNavBar from "../components/AdminNavBar";
import AdminSiderBar from "../components/AdminSiderBar";
//-------------------------------------------------------------------
import Preloader from "../components/Preloader";
//-------------------------------------------------------------------
function RouteWithAdminSideBar({ children }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Preloader show={loaded ? false : true} />
      <AdminSiderBar />

      <main className="content">
        <AdminNavBar />
        {children}
      </main>
    </>
  );
}

export default RouteWithAdminSideBar;

import React, { useEffect, useState } from "react";
//-------------------------------------------------------------------
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import Sidebar from "../components/Sidebar";
//-------------------------------------------------------------------
function RouteWithSideBar({ children }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  /* const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  }; */
  /* const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  ); */
  /* const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  }; */
  //-------------------------------------------------------------------
  return (
    <>
      <Preloader show={loaded ? false : true} />
      <Sidebar />

      <main className="content">
        <Navbar />
        {children}
        {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
      </main>
    </>
  );
}
//-------------------------------------------------------------------
export default RouteWithSideBar;

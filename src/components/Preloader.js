import React from "react";
import { Image } from "@themesberg/react-bootstrap";

import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";
import { BreedingRhombusSpinner } from "react-epic-spinners";
/* export default  */ function Preloader(props) {
  const { show } = props;

  return (
    /*  */
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}
    >
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={ReactLogo}
        height={40}
      />
      {/* <BreedingRhombusSpinner
        className="loader-element animate__animated animate__jackInTheBox"
        color="red"
        size={80}
      /> */}
    </div>
  );
}
export default Preloader;

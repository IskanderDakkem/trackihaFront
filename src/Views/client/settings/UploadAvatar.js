// **  react imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//------------------------------------------------------------------------
import { Card, Image, Alert, Spinner } from "@themesberg/react-bootstrap";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//------------------------------------------------------------------------
import { Routes } from "../../../Context/routes";
import ApiLinks from "../../../Context/ApiLinks";
import axios from "../../../Context/Axios";
import useAuth from "../../../Context/useAuth";
import { BASE_PATH } from "../../../Context/Axios";
//------------------------------------------------------------------------
import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
//------------------------------------------------------------------------
function UploadAvatar() {
  const navigate = useHistory();
  const { Auth, setAuth } = useAuth();
  const Token = localStorage.getItem("Token");
  //----------------------------------------------------------------
  const [avatar, setAvatar] = useState({ preview: Profile3, raw: "" });
  const getUserAavatar = async () => {
    await axios
      .get(ApiLinks.User.getUser + Auth, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          if (
            res?.data?.item?.avatar?.length === 0 ||
            res?.data?.item?.avatar?.length === undefined
          ) {
            setAvatar((prev) => ({ preview: Profile3, raw: "" }));
          } else if (res?.data?.item?.avatar?.length > 1) {
            setAvatar((prev) => ({
              preview: BASE_PATH + res?.data?.item?.avatar,
              raw: "",
            }));
          }
          /* if (avatar.length === 0) {
              setAvatar((prev) => ({ preview: Profile3, raw: "" }));
            } */
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 401) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 403) {
          setAuth(null);
          localStorage.removeItem("Token");
          navigate.push(Routes.Signin.path);
        }
        if (err?.response?.status === 404) {
          navigate.push(Routes.NotFound.path);
        }
        if (err?.response?.status === 500) {
          navigate.push(Routes.ServerError.path);
        }
      });
  };

  //----------------------------------------------------------------
  const [spinningButton, setSpinningButton] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [backErrors, setBackErrors] = useState("");
  const [successfully, setSuccessfully] = useState("");
  //----------------------------------------------------------------
  const onChangeFile = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setAvatar({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: files[0],
      });
    }
  };
  //----------------------------------------------------------------
  useEffect(() => {
    if (Auth !== null && Auth !== undefined && Auth !== 0) {
      getUserAavatar();
    }
  }, [successfully]);
  //----------------------------------------------------------------
  const onUploadFile = async () => {
    setInputErrors({});
    setBackErrors("");
    setSuccessfully("");
    setInputErrors(validate(avatar.raw));
    if (Object.keys(inputErrors).length === 0) {
      setSpinningButton(true);
      const formData = new FormData();
      formData.append("file", avatar.raw);
      await axios
        .post(ApiLinks.User.updateAvatar + Auth, formData, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((res) => {
          const { status } = res;
          if (status === 200) {
            setSuccessfully("Icons successfully updated");
            setTimeout(() => {
              setSuccessfully("");
            }, 5000);
            window.location.reload();
          }
        })
        .catch((err) => {
          setInputErrors("");
          if (err?.response?.status === 400) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 401) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 403) {
            setAuth(null);
            localStorage.removeItem("Token");
            navigate.push(Routes.Signin.path);
          }
          if (err?.response?.status === 406) {
            setBackErrors("The new company name is required!");
          }
          if (err?.response?.status === 404) {
            navigate.push(Routes.NotFound.path);
          }
          if (err?.response?.status === 500) {
            navigate.push(Routes.ServerError.path);
          }
        });
    }
    setSpinningButton(false);
  };

  const validate = (values) => {
    const errors = {};
    if (!values) {
      errors.required = "Upload an image first!";
    }
    return errors;
  };
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">{"Select profile photo"}</h5>
        <div className="d-xl-flex align-items-center">
          <div className="user-avatar xl-avatar">
            <Image fluid rounded src={avatar.preview} />
          </div>
          <div className="file-field">
            <div className="d-flex justify-content-xl-center ms-xl-3">
              <div className="d-flex">
                <span className="icon icon-md">
                  <FontAwesomeIcon icon={faPaperclip} className="me-3" />
                </span>
                <input type="file" onChange={onChangeFile} />
                <div className="d-md-block text-start">
                  <div className="fw-normal text-dark mb-1">Choose Image</div>
                  <div className="text-gray small">PNG. Max size of 100K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
      {inputErrors.required && (
        <Alert variant="danger" className="mx-3">
          {inputErrors.required}
        </Alert>
      )}
      {backErrors.length > 0 && <Alert variant="danger">{backErrors}</Alert>}
      {successfully.length !== 0 && (
        <Alert variant="success" className="mx-3">
          {successfully}
        </Alert>
      )}
      <button className="btn btn-primary w-25 ms-3 mb-3" onClick={onUploadFile}>
        {spinningButton ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          "Upload"
        )}
      </button>
    </Card>
  );
}
//------------------------------------------------------------------------
export default UploadAvatar;

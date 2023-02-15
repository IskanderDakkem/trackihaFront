import React, { useState, useEffect } from "react";
import "../scss/order-track.css";
import { useParams, useHistory } from "react-router-dom";
import Axios, { BASE_PATH } from "./../Context/Axios";
import ApiLinks from "./../Context/ApiLinks";
import { Routes } from "./../Context/routes";
// ** --------------------------------------------------------------------------------
function TrackOrder() {
  const navigate = useHistory();
  const { id } = useParams();
  if (!id) {
    navigate.push(Routes.NotFound.path);
  }
  /* const id = "OZ20221671211143"; */
  const [order, setOrder] = useState({});
  /*  const [sequence, setSequence] = useState({}); */
  const [steps, setSteps] = useState([]);
  const [stepsDate, setStepsDate] = useState([]);
  const getOrder = async () => {
    try {
      const res = await Axios.get(ApiLinks.Orders.Track + id);
      if (res?.status === 200) {
        console.log("res: ", res);
        setOrder((prev) => ({ ...res?.data?.Order }));
        /* setSequence((prev) => ({ ...res?.data?.Sequence })); */
        setSteps((prev) => [...res?.data?.Steps]);
        setStepsDate((prev) => [...res?.data?.stepsDate]);
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        window.alert("Something went wrong");
        // content
      }
      if (error?.response?.status === 404) {
        window.alert("Not found");
        // content
      }
      if (error?.response?.status === 406) {
        window.alert("Missing id");
        // content
      }
      if (error?.response?.status === 500) {
        window.alert("Server error");
        // content
      }
    }
  };
  useEffect(() => {
    getOrder();
  }, [id]);
  // **==>
  return (
    <div className="main_container mt-5">
      <div class="container padding-bottom-3x mb-1">
        <div class="card mb-3">
          <div class="p-4 text-center text-white text-lg bg-dark rounded-top">
            <span class="text-uppercase">Tracking Order No - </span>
            <span class="text-medium">{id}</span>
          </div>
          <div class="d-flex flex-wrap flex-sm-nowrap justify-content-between py-3 px-2 bg-secondary">
            <div class="w-100 text-center py-1 px-2">
              <span class="text-medium">Estimated delivery date: </span>
              {new Date(order?.estimatedDeliveryDate).toDateString()}
            </div>
          </div>
          <div class="card-body">
            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
              {steps?.map((item, index) => {
                const orderNotification = {
                  grayScale: "",
                };
                if (stepsDate[index]?.Date === null) {
                  orderNotification.grayScale = 1;
                } else {
                  orderNotification.grayScale = 0;
                }
                return (
                  <div
                    class={`step ${
                      stepsDate[index]?.Date !== null ? "completed" : ""
                    }`}
                    key={`step-${index}`}
                  >
                    <div class="step-icon-wrap">
                      <div class="step-icon">
                        <img
                          src={BASE_PATH + item?.icone}
                          alt={""}
                          style={{
                            filter: `grayscale(${orderNotification.grayScale})`,
                          }}
                        />
                      </div>
                    </div>
                    <h4 class="step-title">{item?.label}</h4>
                    <h5 class="step-title">
                      {new Date(stepsDate[index]?.Date).toDateString()}
                    </h5>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;

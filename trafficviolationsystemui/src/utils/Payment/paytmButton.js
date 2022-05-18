import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storePayment, violationClosure } from "../../libs/api";
const PaytmChecksum = require("./paytmChecksum");
const https = require("https");

export function PaytmButton({ amount, orderid, regno }) {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    token: "",
    order: "",
    mid: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [amount, orderid, regno]);

  const initialize = () => {
    let orderId = "TVS_" + new Date().getTime();
    let mid = "Hpupag54152173249034";
    let mkey = "9kaAMEpR#OlXsgqg";
    var paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: mid,
      websiteName: "TRAFFICVIOLATIONSYSTEM",
      orderId: orderId,
      callbackUrl: "https://merchant.com/callback",
      txnAmount: {
        value: amount, //AMOUNT
        currency: "INR",
      },
      userInfo: {
        custId: localStorage.getItem("loginid"), //LOGINID
      },
    };

    PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      mkey
    ).then(function (checksum) {
      paytmParams.head = {
        signature: checksum,
      };

      var post_data = JSON.stringify(paytmParams);

      var options = {
        hostname: "securegw-stage.paytm.in",
        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });
        post_res.on("end", function () {
          setPaymentData({
            ...paymentData,
            token: JSON.parse(response).body.txnToken,
            order: orderId,
            mid: mid,
            amount: amount, //AMOUNT
          });
        });
      });

      post_req.write(post_data);
      post_req.end();
    });
  };

  const makePayment = () => {
    setLoading(true);

    var config = {
      root: "",
      style: {
        bodyBackgroundColor: "#fafafb",
        bodyColor: "",
        themeBackgroundColor: "#0FB8C9",
        themeColor: "#ffffff",
        headerBackgroundColor: "#284055",
        headerColor: "#ffffff",
        errorColor: "",
        successColor: "",
        card: {
          padding: "",
          backgroundColor: "",
        },
      },
      data: {
        orderId: paymentData.order,
        token: paymentData.token,
        tokenType: "TXN_TOKEN",
        amount: paymentData.amount,
      },
      payMode: {
        labels: {},
        filter: {
          exclude: [],
        },
        order: ["CC", "DC", "NB", "UPI", "PPBL", "PPI", "BALANCE"],
      },
      website: "TRAFFICVIOLATIONSYSTEM",
      flow: "DEFAULT",
      merchant: {
        mid: paymentData.mid,
        redirect: false,
      },
      handler: {
        transactionStatus: async function transactionStatus(paymentStatus) {
          if (paymentStatus.STATUS === "TXN_SUCCESS") {
            const paymentData = {
              loginid: localStorage.getItem("loginid"),
              transactionstatus: 1,
              userviolationid: orderid,
              amount: amount,
              paymentmode: paymentStatus.PAYMENTMODE,
              vehicleregno: regno,
              transactionid: paymentStatus.TXNID,
            };

            await storePayment(paymentData)
              .then(async (res) => {
                if (res.status_code === 201) {
                  const violationData = {
                    isopen: 1,
                  };
                  await violationClosure(violationData, orderid)
                    .then((res) => {
                      if (res.status_code === 200) {
                        setTimeout(() => {
                          navigate("/paymentsuccess");
                          window.location.reload();
                        }, 500);
                      }
                    })
                    .catch((error) => {
                      alert(error.message);
                    });
                }
              })
              .catch((error) => {
                alert(error.message);
              });
          } else {
            const paymentData = {
              loginid: localStorage.getItem("loginid"),
              transactionstatus: 0,
              userviolationid: orderid,
              amount: amount,
              paymentmode: paymentStatus.PAYMENTMODE,
              vehicleregno: regno,
              transactionid: paymentStatus.TXNID,
            };

            await storePayment(paymentData)
              .then((res) => {
                if (res.status_code === 201) {
                  setTimeout(() => {
                    navigate("/paymentfailure");
                    window.location.reload();
                  }, 500);
                }
              })
              .catch((error) => {
                alert(error.message);
              });
          }

          setLoading(false);
        },
        notifyMerchant: function notifyMerchant(eventName, data) {
          setLoading(false);
        },
      },
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          alert("Error => ", error);
        });
    }
  };

  return (
    <div>
      {loading ? (
        <img
          src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
          alt="loading"
          style={{
            height: "30px",
            width: "30px",
          }}
        />
      ) : (
        <Button
          variant="contained"
          autoFocus
          onClick={makePayment}
          style={{
            backgroundColor: "#4CD137",
            color: "white",
            marginLeft: "1rem",
          }}
        >
          Confirm
        </Button>
      )}
    </div>
  );
}

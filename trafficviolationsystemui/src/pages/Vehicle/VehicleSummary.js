import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { getVehicleSummary } from "../../libs/api";
import { useState, useEffect } from "react";
import Topbar from "../../layouts/Topbar/Topbar";
import Card from "../../layouts/Card/Card";
import Grid from "@mui/material/Grid";

export default function VehicleSummary() {
  const [summary, setSummary] = useState({});
  const [vehicledetails, setVehicledetails] = useState({});
  const [puc, setPuc] = useState({});
  const [insurance, setInsurance] = useState({});

  const params = useParams();
  const { vehicleregno } = params;

  const convertData = (d) => {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "-" + month + "-" + year;
  };

  useEffect(() => {
    async function fetchVehicleData() {
      await getVehicleSummary(vehicleregno).then(async (data) => {
        if (data.ok && data.status === 200) {
          const resData = await data.json();
          console.log(resData);
          setSummary(resData.Registration.summary);
          setVehicledetails(resData.Registration.vehicledetails);
          setPuc(resData.Registration.puc);
          setInsurance(resData.Registration.insurance);
        }
      });
    }
    fetchVehicleData().catch((err) => {
      console.log(err);
    });
  }, [vehicleregno]);

  return (
    <Fragment>
      <Topbar>{vehicleregno}</Topbar>
      <Card>
        <h2>Registration Summary</h2>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Registration No. : {summary.regno}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Chassic No. : {summary.chasisnumber}</p>
          </Grid>
          <Grid item xs={4}>
            <p>RTO Name : {summary.rtoname}</p>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Registration Date : {convertData(summary.registrationdate)}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Expiry Date : {convertData(summary.expirydate)}</p>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <h2>Vehicle Details</h2>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Fuel Type : {vehicledetails.fueltype}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Age : {vehicledetails.age}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Modal : {vehicledetails.model}</p>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Manufacturer : {vehicledetails.manufacturer}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Purchase Date : {convertData(vehicledetails.purchasedate)}</p>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <h2>Insurance Details</h2>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Start Date : {convertData(insurance.startdate)}</p>
          </Grid>
          <Grid item xs={4}>
            <p>End Date : {convertData(insurance.enddate)}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Provider Name : {insurance.providername}</p>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Coverage : {insurance.coverage}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Identity Proof : {insurance.identityproof}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Identity Proof No : {insurance.identityproof_no}</p>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <h2>PUC Details</h2>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>PUC Serial No. : {puc.pucserialno}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Test Validity Period : {puc.validtype}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Emmision Reading : {puc.emissionreading}</p>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p>Start Date : {convertData(puc.startdate)}</p>
          </Grid>
          <Grid item xs={4}>
            <p>End Date : {convertData(puc.enddate)}</p>
          </Grid>
          <Grid item xs={4}>
            <p>Provider Name : {puc.providername}</p>
          </Grid>
        </Grid>
      </Card>
    </Fragment>
  );
}

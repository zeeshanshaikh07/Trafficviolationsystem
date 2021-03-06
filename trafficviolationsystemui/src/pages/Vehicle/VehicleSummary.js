import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { getVehicleSummary } from "../../libs/api";
import { useState, useEffect } from "react";
import Topbar from "../../layouts/Topbar/Topbar";
import Card from "../../layouts/Card/Card";
import Grid from "@mui/material/Grid";
import FormatDate from "../../utils/FormatDate";

export default function VehicleSummary() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [summary, setSummary] = useState({});
  const [vehicledetails, setVehicledetails] = useState({});
  const [puc, setPuc] = useState({});
  const [insurance, setInsurance] = useState({});

  const params = useParams();
  const { vehicleregno, chassisno } = params;

  useEffect(() => {
    async function fetchVehicleData() {
      await getVehicleSummary(vehicleregno, chassisno).then(async (data) => {
        if (data.ok && data.status === 200) {
          const resData = await data.json();

          setSummary(resData.Registration.summary);
          setVehicledetails(resData.Registration.vehicledetails);
          setPuc(resData.Registration.puc);
          setInsurance(resData.Registration.insurance);
          setIsLoading(false);
          setError("");
        } else {
          setError("Something went wrong!");
          setIsLoading(false);
        }
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, [vehicleregno, chassisno]);

  if (isLoading) {
    return (
      <section
        style={{
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <Fragment>
      <Topbar>{vehicleregno}</Topbar>
      {error && (
        <section
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "red",
          }}
        >
          <p>{error}</p>
        </section>
      )}
      {!error && (
        <Fragment>
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
                <p>
                  Registration Date : {FormatDate(summary.registrationdate)}
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>Expiry Date : {FormatDate(summary.expirydate)}</p>
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
                <p>Purchase Date : {FormatDate(vehicledetails.purchasedate)}</p>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <h2>Insurance Details</h2>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <p>Start Date : {FormatDate(insurance.startdate)}</p>
              </Grid>
              <Grid item xs={4}>
                <p>End Date : {FormatDate(insurance.enddate)}</p>
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
                <p>Start Date : {FormatDate(puc.startdate)}</p>
              </Grid>
              <Grid item xs={4}>
                <p>End Date : {FormatDate(puc.enddate)}</p>
              </Grid>
              <Grid item xs={4}>
                <p>Provider Name : {puc.providername}</p>
              </Grid>
            </Grid>
          </Card>
        </Fragment>
      )}
    </Fragment>
  );
}

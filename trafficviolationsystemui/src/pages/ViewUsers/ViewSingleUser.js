import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Fragment } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import classes from "../../assets/Styling/Auth.module.css";
import { CssBaseline } from "@mui/material";
import Card from "../../layouts/Card/Card";
import { getUserBasicDetails } from "../../libs/api";
import { useParams } from "react-router-dom";
import Topbar from "../../layouts/Topbar/Topbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { getUserAddress } from "../../libs/api";
import Address from "../Profile/Address";

const theme = createTheme();

export default function ViewSingleUser(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [userdata, setUserdata] = React.useState([]);

  const params = useParams();
  const { loginid } = params;

  const [addressdata, setAddressdata] = React.useState([]);

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getUserAddress(loginid).then((data) => {
        if (data.length !== 0) {
          setAddressdata(data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, [loginid]);

  console.log(addressdata);

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getUserBasicDetails(loginid).then((data) => {
        if (data.length !== 0) {
          setUserdata(data);

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, [loginid]);

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
      <ThemeProvider theme={theme}>
        <Topbar>{userdata.loginid}</Topbar>
        <Button
          style={{
            backgroundColor: "#313082",
            float: "right",
            border: "none",
            color: "white",
            borderRadius: "20px",
            padding: "10px 30px",
            marginRight: "30px",
            marginTop: "30px",
          }}
          variant="contained"
        >
          <Link
            style={{
              textDecoration: "none",
              color: "white",
            }}
            to={`/viewuservehicle/${loginid}`}
          >
            View Vehicles
          </Link>
        </Button>
        <Button
          style={{
            backgroundColor: "#313082",
            float: "right",
            border: "none",
            color: "white",
            borderRadius: "20px",
            padding: "10px 30px",
            marginRight: "30px",
            marginTop: "30px",
          }}
          variant="contained"
        >
          <Link
            style={{
              textDecoration: "none",
              color: "white",
            }}
            to={`/viewpayments/${loginid}`}
          >
            View Payments
          </Link>
        </Button>
        <div
          style={{
            marginTop: "100px",
          }}
        >
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
          <Card>
            {!isLoading && !error && (
              <Container
                border={3}
                display="flex"
                color="gray"
                fontSize={15}
                component="form"
                noValidate
              >
                <CssBaseline />
                <Grid
                  container
                  spacing={1}
                  justify="space-between"
                  alignItems="stretch"
                  className={classes.outline}
                >
                  <Grid item xs={12}>
                    <h2
                      style={{
                        color: "black",
                        textAlign: "left",
                        fontWeight: "regular",
                        fontStyle: "normal",
                      }}
                    >
                      Basic Details
                    </h2>
                  </Grid>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <h4>Username : {userdata.loginid}</h4>
                      </Grid>
                      <Grid item xs={4}>
                        <h4>Fullname : {userdata.fullname}</h4>
                      </Grid>
                      <Grid item xs={4}>
                        <h4>Email id : {userdata.emailid}</h4>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <h4>DOB : {userdata.DOB}</h4>
                      </Grid>
                      <Grid item xs={4}>
                        <h4>Mobile Number : {userdata.mobileno}</h4>
                      </Grid>
                      <Grid item xs={4}>
                        <h4>
                          Role : {userdata.roleid === 3 ? "User" : "Admin"}
                        </h4>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Container>
            )}
          </Card>
          {addressdata.map((add) => (
            <Card>
              {!isLoading && !error && (
                <Container
                  border={3}
                  display="flex"
                  color="gray"
                  fontSize={15}
                  component="form"
                  noValidate
                >
                  <CssBaseline />
                  <Grid
                    container
                    spacing={1}
                    justify="space-between"
                    alignItems="stretch"
                    className={classes.outline}
                  >
                    <Grid item xs={12}>
                      <h2
                        style={{
                          color: "black",
                          textAlign: "left",
                          fontWeight: "regular",
                          fontStyle: "normal",
                        }}
                      >
                        {add.addresstype} Address
                      </h2>
                    </Grid>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <h4>House Number : {add.houseno}</h4>
                        </Grid>
                        <Grid item xs={4}>
                          <h4>Area Name : {add.areaname}</h4>
                        </Grid>
                        <Grid item xs={4}>
                          <h4>Pincode : {add.pincode}</h4>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <h4>City : {add.DOB}</h4>
                        </Grid>
                        <Grid item xs={4}>
                          <h4>State : {add.state}</h4>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Container>
              )}
            </Card>
          ))}
        </div>
      </ThemeProvider>
    </Fragment>
  );
}

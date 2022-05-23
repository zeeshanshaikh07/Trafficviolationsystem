import * as React from "react";
import { Fragment } from "react";
import { getAllVehicles } from "../../libs/api";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-confirm-alert/src/react-confirm-alert.css";
import Card from "../../layouts/Card/Card";
import Topbar from "../../layouts/Topbar/Topbar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";

const theme = createTheme();

export default function ViewUserVehicle(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isVehicleEmpty, setIsVehicleEmpty] = React.useState(false);
  const [vehicledata, setVehicledata] = React.useState([]);

  const params = useParams();
  const { loginid } = params;

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getAllVehicles(loginid).then((data) => {
        if (data.length !== 0) {
          setVehicledata(data);
          setIsVehicleEmpty(false);
          setIsLoading(false);
        } else {
          setIsVehicleEmpty(true);
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
        <Topbar>User Vehicles</Topbar>

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
        {isVehicleEmpty && (
          <section
            style={{
              textAlign: "center",
              fontSize: "20px",
              color: "red",
            }}
          >
            <p>No vehicle added.</p>
          </section>
        )}
        {vehicledata.map((vehicle) => (
          <Card>
            {!isLoading && !error && !isVehicleEmpty && (
              <Box component="form" noValidate sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <h3>Registration Number : {vehicle.regno}</h3>
                  </Grid>
                  <Grid item xs={5}>
                    <h3>Chassis Number : {vehicle.chassisno}</h3>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      style={{
                        backgroundColor: "#313082",
                        float: "right",
                        border: "none",
                        color: "white",
                        borderRadius: "20px",
                        padding: "10px 30px",
                        marginTop: "10px",
                      }}
                      variant="contained"
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "white",
                        }}
                        to={`/vehicles/${vehicle.regno}`}
                      >
                        View details
                      </Link>
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        ))}
      </ThemeProvider>
    </Fragment>
  );
}

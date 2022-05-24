import { Fragment } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { confirmAlert } from "react-confirm-alert";
import { deleteVehicle } from "../../libs/api";
import "react-confirm-alert/src/react-confirm-alert.css";
import Card from "../../layouts/Card/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function SingleVehicle(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const deleteUserVehicle = (event) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure want to delete this vehicle.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setIsLoading(true);
            await deleteVehicle(event.target.id)
              .then((res) => {
                if (res.status_code === 200) {
                  setIsLoading(false);
                  setSuccess(res.message);
                } else {
                  setIsLoading(false);
                  setError(res.message);
                }
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              })
              .catch((err) => {
                setIsLoading(false);
                setError(err.message);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Card>
          {isLoading && <Alert severity="info">Deleting...</Alert>}
          {!isLoading && success === "" && error !== "" && (
            <Alert severity="error">{error}</Alert>
          )}

          {!isLoading && success !== "" && (
            <Alert severity="success">{success}</Alert>
          )}
          <Box component="form" noValidate sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <h3>Registration Number : {props.regno}</h3>
              </Grid>
              <Grid item xs={4}>
                <h3>Chassis Number : {props.chassisno}</h3>
              </Grid>
              <Grid item xs={4} sx={{ mt: 1.3 }}>
                <Grid container>
                  <Grid item xs={4}>
                    <Button
                      style={{
                        backgroundColor: "#313082",
                        float: "right",
                        border: "none",
                        color: "white",
                        borderRadius: "20px",
                        padding: "10px 30px",
                      }}
                      variant="contained"
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "white",
                        }}
                        to={`/vehicles/${props.regno}/${props.chassisno}`}
                      >
                        View
                      </Link>
                    </Button>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={deleteUserVehicle}
                      style={{
                        backgroundColor: "#E84118",
                        float: "right",
                        border: "none",
                        color: "white",
                        borderRadius: "20px",
                        padding: "10px 20px",
                      }}
                      variant="contained"
                      id={props.regno}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </ThemeProvider>
    </Fragment>
  );
}

import { Fragment } from "react";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteVehicle, updateVehicle } from "../../libs/api";
import useInput from "../../hooks/use-input";
import Card from "../../layouts/Card/Card";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function SingleVehicle(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    hasError: vehicleregnoError,
    inputChangeHander: vehicleregnoInputChangeHander,
    inputBlurHandler: vehicleregnoInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    hasError: vehiclechassisnoError,
    inputChangeHander: vehiclechassisnoInputChangeHander,
    inputBlurHandler: vehiclechassisnoInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

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
                if (res.status_code === 204) {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (
      data.get("vehicleregno").length === 0 ||
      data.get("vehiclechassisno").length === 0
    ) {
      return;
    }

    const vehicleData = {
      regno: data.get("vehicleregno"),
      chassisno: data.get("vehiclechassisno"),
    };

    await updateVehicle(vehicleData, data.get("uservehicleid"))
      .then((res) => {
        if (res.status_code === 204) {
          setIsLoading(false);
          setSuccess(res.message);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          setIsLoading(false);
          setError(res.message);
        }
      })
      .catch((error) => {
        setError(error.message);
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ flexGrow: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  defaultValue={props.regno}
                  onChange={vehicleregnoInputChangeHander}
                  onBlur={vehicleregnoInputBlurHandler}
                  error={vehicleregnoError}
                  helperText={
                    vehicleregnoError
                      ? "Please add new vehicle registration number!"
                      : " "
                  }
                  margin="normal"
                  required
                  fullWidth
                  id="vehicleregno"
                  label="Vehicle registration number"
                  name="vehicleregno"
                  autoComplete="vehicleregno"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={props.chassisno}
                  onChange={vehiclechassisnoInputChangeHander}
                  onBlur={vehiclechassisnoInputBlurHandler}
                  error={vehiclechassisnoError}
                  helperText={
                    vehiclechassisnoError
                      ? "Please add new chassis number!"
                      : " "
                  }
                  margin="normal"
                  required
                  fullWidth
                  id="vehiclechassisno"
                  label="Vehicle chassic number"
                  name="vehiclechassisno"
                  autoComplete="vehiclechassisno"
                />
                <TextField
                  id="uservehicleid"
                  name="uservehicleid"
                  defaultValue={props.uservehicleid}
                  style={{
                    display: "none",
                  }}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: 3 }}>
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
                      View
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#4CD137",
                        float: "right",
                        border: "none",
                        color: "white",
                        borderRadius: "20px",
                        padding: "10px 20px",
                      }}
                      variant="contained"
                      onSubmit={handleSubmit}
                    >
                      Update
                    </Button>
                  </Grid>
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
                      id={props.uservehicleid}
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

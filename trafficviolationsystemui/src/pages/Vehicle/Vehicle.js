import { Fragment } from "react";
import { addVehicle } from "../../libs/api";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Vehicles from "../../components/Vehicle/Vehicles";
import Topbar from "../../layouts/Topbar/Topbar";
import Card from "../../layouts/Card/Card";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useInput from "../../hooks/use-input";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function Vehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    value: vehicleregno,
    hasError: vehicleregnoError,
    valueIsValid: vehicleregnoIsValid,
    inputChangeHander: vehicleregnoInputChangeHander,
    inputBlurHandler: vehicleregnoInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: vehiclechassisno,
    hasError: vehiclechassisnoError,
    valueIsValid: vehiclechassisnoIsValid,
    inputChangeHander: vehiclechassisnoInputChangeHander,
    inputBlurHandler: vehiclechassisnoInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    if (!vehicleregnoIsValid || !vehiclechassisnoIsValid) {
      setIsLoading(false);
      return;
    }

    const data = new FormData(event.currentTarget);

    const vehicleData = {
      regno: data.get("vehicleregno"),
      chassisno: data.get("vehiclechassisno"),
    };

    await addVehicle(vehicleData)
      .then((res) => {
        if (res.status_code === 200 || res.status_code === 201) {
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
        <Topbar>Add Vehicle</Topbar>

        {isLoading && <Alert severity="info">Adding...</Alert>}
        {!isLoading && success === "" && error !== "" && (
          <Alert severity="error">{error}</Alert>
        )}

        {!isLoading && success !== "" && (
          <Alert severity="success">{success}</Alert>
        )}
        <Card>
          <h2>Add new vehicle</h2>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ flexGrow: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  value={vehicleregno}
                  onChange={vehicleregnoInputChangeHander}
                  onBlur={vehicleregnoInputBlurHandler}
                  error={vehicleregnoError}
                  helperText={
                    vehicleregnoError
                      ? "Please enter vehicle registration number!"
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
                  value={vehiclechassisno}
                  onChange={vehiclechassisnoInputChangeHander}
                  onBlur={vehiclechassisnoInputBlurHandler}
                  error={vehiclechassisnoError}
                  helperText={
                    vehiclechassisnoError
                      ? "Please enter vehicle chassic number!"
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
              </Grid>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  sx={{ mt: 5 }}
                  style={{
                    backgroundColor: "#313082",
                    float: "right",
                    border: "none",
                    color: "white",
                    padding: "15px 40px",
                    borderRadius: "20px",
                  }}
                  variant="contained"
                  onSubmit={handleSubmit}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </ThemeProvider>
      <Vehicles />
    </Fragment>
  );
}

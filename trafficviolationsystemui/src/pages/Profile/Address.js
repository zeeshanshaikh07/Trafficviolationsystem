import * as React from "react";
import useInput from "../../hooks/use-input";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import classes from "../../assets/Styling/Auth.module.css";
import { CssBaseline } from "@mui/material";
import Card from "../../layouts/Card/Card";
import { updateUserAddress } from "../../libs/api";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function Address(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");

  const {
    hasError: housenumError,
    inputChangeHander: housenumInputChangeHandler,
    inputBlurHandler: housenumInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    hasError: areanameError,
    inputChangeHander: areanameInputChangeHandler,
    inputBlurHandler: areanameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    hasError: pincodeError,
    inputChangeHander: pincodeInputChangeHandler,
    inputBlurHandler: pincodeInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    hasError: cityError,
    inputChangeHander: cityInputChangeHandler,
    inputBlurHandler: cityInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    hasError: stateError,
    inputChangeHander: stateInputChangeHandler,
    inputBlurHandler: stateInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // setIsLoading(true);
    const data = new FormData(event.currentTarget);

    if (
      data.get("housenum").length === 0 ||
      data.get("areaname").length === 0 ||
      data.get("pincode").length === 0 ||
      data.get("city").length === 0 ||
      data.get("state").length === 0
    ) {
      return;
    }

    const addData = {
      addresstype: props.addresstype,
      houseno: data.get("housenum"),
      areaname: data.get("areaname"),
      pincode: data.get("pincode"),
      city: data.get("city"),
      state: data.get("state"),
    };

    console.log(addData);
    await updateUserAddress(addData, props.addressid)
      .then((res) => {
        if (res.status_code === 200) {
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
          {isLoading && <Alert severity="info">Loading...</Alert>}

          {!isLoading && success === "" && error !== "" && (
            <Alert severity="error">{error}</Alert>
          )}

          {!isLoading && success !== "" && (
            <Alert severity="success">{success}</Alert>
          )}
          <Container
            border={3}
            display="flex"
            color="gray"
            fontSize={15}
            component="form"
            onSubmit={handleSubmit}
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
                  {props.addresstype} Address
                </h2>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  defaultValue={props.houseno}
                  onChange={housenumInputChangeHandler}
                  onBlur={housenumInputBlurHandler}
                  error={housenumError}
                  helperText={
                    housenumError ? "Please enter house number!" : " "
                  }
                  required
                  fullWidth
                  id="housenum"
                  label="House Number"
                  type="text"
                  name="housenum"
                  autoComplete="housenum"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={props.areaname}
                  onChange={areanameInputChangeHandler}
                  onBlur={areanameInputBlurHandler}
                  error={areanameError}
                  helperText={areanameError ? "Please enter area name!" : " "}
                  required
                  fullWidth
                  name="areaname"
                  label="Area Name"
                  type="text"
                  id="areaname"
                  autoComplete="areaname"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={props.pincode}
                  onChange={pincodeInputChangeHandler}
                  onBlur={pincodeInputBlurHandler}
                  error={pincodeError}
                  helperText={pincodeError ? "Please enter city!" : " "}
                  required
                  fullWidth
                  id="pincode"
                  label="Pincode"
                  type="number"
                  name="pincode"
                  autoComplete="pincode"
                  size="small"
                  pattern="[0=9]*"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={props.city}
                  onChange={cityInputChangeHandler}
                  onBlur={cityInputBlurHandler}
                  error={cityError}
                  helperText={cityError ? "Please enter city!" : " "}
                  required
                  fullWidth
                  name="city"
                  label="City"
                  id="city"
                  autoComplete="city"
                  size="small"
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  defaultValue={props.state}
                  onChange={stateInputChangeHandler}
                  onBlur={stateInputBlurHandler}
                  error={stateError}
                  helperText={stateError ? "Please enter state" : " "}
                  required
                  fullWidth
                  label="state"
                  name="state"
                  type="text"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#313082",
                    float: "right",
                    border: "none",
                    color: "white",
                    borderRadius: "20px",
                  }}
                  variant="contained"
                  onSubmit={handleSubmit}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Card>
      </ThemeProvider>
    </Fragment>
  );
}

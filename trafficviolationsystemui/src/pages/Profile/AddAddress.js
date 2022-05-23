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
import Topbar from "../../layouts/Topbar/Topbar";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { addAddress } from "../../libs/api";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function AddAddress(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");

  const [age, setAge] = React.useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const {
    value: housenum,
    hasError: housenumError,
    valueIsValid: housenumIsValid,
    inputChangeHander: housenumInputChangeHandler,
    inputBlurHandler: housenumInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: areaname,
    hasError: areanameError,
    valueIsValid: areanameIsValid,
    inputChangeHander: areanameInputChangeHandler,
    inputBlurHandler: areanameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: pincode,
    hasError: pincodeError,
    valueIsValid: pincodeIsValid,
    inputChangeHander: pincodeInputChangeHandler,
    inputBlurHandler: pincodeInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: city,
    hasError: cityError,
    valueIsValid: cityIsValid,
    inputChangeHander: cityInputChangeHandler,
    inputBlurHandler: cityInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: state,
    hasError: stateError,
    valueIsValid: stateIsValid,
    inputChangeHander: stateInputChangeHandler,
    inputBlurHandler: stateInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    if (
      !housenumIsValid ||
      !areanameIsValid ||
      !pincodeIsValid ||
      !cityIsValid ||
      !stateIsValid
    ) {
      setIsLoading(false);
      return;
    }

    const data = new FormData(event.currentTarget);

    const addData = {
      houseno: data.get("housenum"),
      areaname: data.get("areaname"),
      pincode: data.get("pincode"),
      city: data.get("city"),
      state: data.get("state"),
      addresstype: data.get("addresstype"),
    };

    await addAddress(addData)
      .then((res) => {
        if (res.status_code === 201) {
          setIsLoading(false);
          setSuccess(res.message);
          setTimeout(() => {
            navigate("/profile");
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
        <Topbar>Add Address</Topbar>
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
                  Add Address
                </h2>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  value={housenum}
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
                  value={areaname}
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
                  value={pincode}
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
                  value={city}
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
                  //InputLabelProps={{ shrink: true }}
                  value={state}
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
              <Grid item xs={4}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="addtype">Type</InputLabel>
                    <Select
                      labelId="addtype"
                      id="addresstype"
                      name="addresstype"
                      value={age}
                      label="Type"
                      size="small"
                      onChange={handleChange}
                    >
                      <MenuItem value="Permanent">Permanent</MenuItem>
                      <MenuItem value="Correspondence">Correspondence</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
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
                  Add
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Card>
      </ThemeProvider>
    </Fragment>
  );
}

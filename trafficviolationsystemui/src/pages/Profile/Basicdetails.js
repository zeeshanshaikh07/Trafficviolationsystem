import * as React from "react";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import classes from "../../assets/Styling/Auth.module.css";
import { CssBaseline } from "@mui/material";
import Card from "../../layouts/Card/Card";
import { getBasicDetails, updateBasicDetails } from "../../libs/api";
import FormatDate from "../../utils/FormatDate";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function BasicDetails(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [userdata, setUserdata] = React.useState([]);

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getBasicDetails().then((data) => {
        if (data.length !== 0) {
          setUserdata(data);
        }

        setIsLoading(false);
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const uuserData = {
      loginid: data.get("loginid"),
      fullname: data.get("fullname"),
      emailid: data.get("emailid"),
      mobileno: data.get("mobileno"),
      DOB: data.get("DOB"),
    };

    await updateBasicDetails(uuserData)
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

  const changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserdata({
      [name]: value,
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
                  Basic Details
                </h2>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={userdata.loginid}
                  onChange={changeHandler}
                  // error={usernameError}
                  // helperText={usernameError ? "Please enter username!" : " "}
                  required
                  fullWidth
                  id="loginid"
                  label="Username"
                  name="loginid"
                  autoComplete="loginid"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={userdata.fullname}
                  onChange={changeHandler}
                  // error={fullnameError}
                  // helperText={fullnameError ? "Please enter full name!" : " "}
                  required
                  fullWidth
                  name="fullname"
                  label="Full name"
                  type="text"
                  id="fullname"
                  autoComplete="fullname"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={userdata.emailid}
                  onChange={changeHandler}
                  // error={emailidError}
                  // helperText={
                  //   emailidError ? "Please enter a valid email address!" : " "
                  // }
                  required
                  fullWidth
                  name="emailid"
                  label="Email address"
                  type="emailid"
                  id="emailid"
                  autoComplete="emailid"
                  size="small"
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={userdata.mobileno}
                  onChange={changeHandler}
                  // error={mobilenoError}
                  // helperText={
                  //   mobilenoError ? "Please enter valid mobile number!" : " "
                  // }
                  required
                  fullWidth
                  name="mobileno"
                  label="Mobile number"
                  type="number"
                  id="mobileno"
                  autoComplete="mobileno"
                  size="small"
                  style={{
                    marginTop: "30px",
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={FormatDate(userdata.DOB)}
                  onChange={changeHandler}
                  // error={dobError}
                  // helperText={dobError ? "Please enter date of birth!" : " "}
                  required
                  fullWidth
                  label="DOB"
                  name="DOB"
                  type="date"
                  size="small"
                  style={{
                    marginTop: "30px",
                  }}
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

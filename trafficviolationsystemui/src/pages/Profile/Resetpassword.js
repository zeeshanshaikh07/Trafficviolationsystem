import * as React from "react";
import useInput from "../../hooks/use-input";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fragment } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import classes from "../../assets/Styling/Auth.module.css";
import { CssBaseline } from "@mui/material";
import TextField from "@mui/material/TextField";
import Card from "../../layouts/Card/Card";
import { resetPassword } from "../../libs/api";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function ResetPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");

  const [isMatch, setIsMatch] = React.useState(false);

  const {
    value: password,
    hasError: passwordError,
    valueIsValid: passwordIsValid,
    inputChangeHander: passwordInputChangeHander,
    inputBlurHandler: passwordInputBlurHandler,
  } = useInput((value) => value.trim().length >= 5);

  const cpasswordInputChangeHander = (event) => {
    if (event.target.value !== password) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    if (!passwordIsValid) {
      setIsLoading(false);

      return;
    }

    const data = new FormData(event.currentTarget);

    const passData = {
      loginid: localStorage.getItem("loginid"),
      password: data.get("password"),
    };

    await resetPassword(passData)
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

    // {
    //   "loginid":"Kadir03",
    //   "password":"1234560987"
    // }
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
                  Reset Password
                </h2>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  size="small"
                  value={password}
                  onChange={passwordInputChangeHander}
                  onBlur={passwordInputBlurHandler}
                  error={passwordError}
                  helperText={
                    passwordError
                      ? "Please enter password of atleast 5 characters!"
                      : " "
                  }
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  size="small"
                  onChange={cpasswordInputChangeHander}
                  error={isMatch}
                  helperText={isMatch ? "Password do not matched!" : " "}
                  margin="normal"
                  required
                  fullWidth
                  name="cpassword"
                  label="Confirm password"
                  type="password"
                  id="cpassword"
                  autoComplete="cpassword"
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
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Card>
      </ThemeProvider>
    </Fragment>
  );
}

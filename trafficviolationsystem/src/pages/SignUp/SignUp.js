import * as React from "react";
import useInput from "../../hooks/use-input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Topbar from "../../layouts/Topbar/Topbar";
import classes from "../../assets/Styling/Auth.module.css";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function SignIn() {
  const [isMatch, setIsMatch] = useState(false);
  const {
    value: username,
    hasError: usernameError,
    valueIsValid: usernameIsValid,
    reset: usernameReset,
    inputChangeHander: usernameInputChangeHander,
    inputBlurHandler: usernameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: fullname,
    hasError: fullnameError,
    valueIsValid: fullnameIsValid,
    reset: fullnameReset,
    inputChangeHander: fullnameInputChangeHander,
    inputBlurHandler: fullnameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: email,
    hasError: emailError,
    valueIsValid: emailIsValid,
    reset: emailReset,
    inputChangeHander: emailInputChangeHander,
    inputBlurHandler: emailInputBlurHandler,
  } = useInput((value) => value.trim().includes("@"));

  const {
    value: mobileno,
    hasError: mobilenoError,
    valueIsValid: mobilenoIsValid,
    reset: mobilenoReset,
    inputChangeHander: mobilenoInputChangeHander,
    inputBlurHandler: mobilenoInputBlurHandler,
  } = useInput((value) => value.trim().length === 10);

  const {
    value: dob,
    hasError: dobError,
    valueIsValid: dobIsValid,
    reset: dobReset,
    inputChangeHander: dobInputChangeHander,
    inputBlurHandler: dobInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: password,
    hasError: passwordError,
    valueIsValid: passwordIsValid,
    reset: passwordReset,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !usernameIsValid ||
      !fullnameIsValid ||
      !emailIsValid ||
      !mobilenoIsValid ||
      !dobIsValid ||
      !passwordIsValid
    ) {
      return;
    }

    usernameReset();
    fullnameReset();
    emailReset();
    mobilenoReset();
    dobReset();
    passwordReset();

    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      fullname: data.get("fullname"),
      email: data.get("email"),
      mobileno: data.get("mobileno"),
      dob: data.get("dob"),
      password: data.get("password"),
    });
  };

  return (
    <Fragment>
      <Topbar>Sign Up</Topbar>
      <ThemeProvider theme={theme}>
        <Container
          className={classes.signin}
          sx={{ mt: 3, mb: 3 }}
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              className={classes.auth_title}
              component="h1"
              variant="h4"
            >
              Sign Up
            </Typography>
            <Typography
              style={{
                fontSize: "15px",
              }}
              sx={{ mt: 3, mb: 3 }}
              component="h6"
              variant="h6"
            >
              Register to Traffic Violation System
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                value={username}
                onChange={usernameInputChangeHander}
                onBlur={usernameInputBlurHandler}
                error={usernameError}
                helperText={usernameError ? "Please enter username!" : " "}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                type="text"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                value={fullname}
                onChange={fullnameInputChangeHander}
                onBlur={fullnameInputBlurHandler}
                error={fullnameError}
                helperText={fullnameError ? "Please enter full name!" : " "}
                margin="normal"
                required
                fullWidth
                name="fullname"
                label="Full name"
                type="text"
                id="fullname"
                autoComplete="fullname"
              />
              <TextField
                value={email}
                onChange={emailInputChangeHander}
                onBlur={emailInputBlurHandler}
                error={emailError}
                helperText={
                  emailError ? "Please enter a valid email address!" : " "
                }
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email address"
                type="email"
                id="email"
                autoComplete="email"
              />

              <TextField
                value={mobileno}
                onChange={mobilenoInputChangeHander}
                onBlur={mobilenoInputBlurHandler}
                error={mobilenoError}
                helperText={
                  mobilenoError ? "Please enter valid mobile number!" : " "
                }
                margin="normal"
                required
                fullWidth
                name="mobileno"
                label="Mobile number"
                type="number"
                id="mobileno"
                autoComplete="mobileno"
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                value={dob}
                onChange={dobInputChangeHander}
                onBlur={dobInputBlurHandler}
                error={dobError}
                helperText={dobError ? "Please enter date of birth!" : " "}
                margin="normal"
                required
                fullWidth
                label="DOB"
                name="dob"
                type="date"
              />
              <TextField
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
              <TextField
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

              <Button
                className={classes.btn}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item sx={{ mb: 2 }}>
                  <Link to="/">Already have an account?Sign In</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

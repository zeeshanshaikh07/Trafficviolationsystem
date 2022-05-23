import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { register } from "../../libs/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import useInput from "../../hooks/use-input";
import Alert from "@mui/material/Alert";
import Topbar from "../../layouts/Topbar/Topbar";
import classes from "../../assets/Styling/Auth.module.css";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const theme = createTheme();

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [isMatch, setIsMatch] = useState(false);
  const {
    value: loginid,
    hasError: loginidError,
    valueIsValid: loginidIsValid,
    inputChangeHander: loginidInputChangeHander,
    inputBlurHandler: loginidInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: fullname,
    hasError: fullnameError,
    valueIsValid: fullnameIsValid,
    inputChangeHander: fullnameInputChangeHander,
    inputBlurHandler: fullnameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: emailid,
    hasError: emailidError,
    valueIsValid: emailidIsValid,
    inputChangeHander: emailidInputChangeHander,
    inputBlurHandler: emailidInputBlurHandler,
  } = useInput((value) => value.trim().includes("@"));

  const {
    value: mobileno,
    hasError: mobilenoError,
    valueIsValid: mobilenoIsValid,
    inputChangeHander: mobilenoInputChangeHander,
    inputBlurHandler: mobilenoInputBlurHandler,
  } = useInput((value) => value.trim().length === 10);

  const {
    value: dob,
    hasError: dobError,
    valueIsValid: dobIsValid,
    inputChangeHander: dobInputChangeHander,
    inputBlurHandler: dobInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

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

    if (
      !loginidIsValid ||
      !fullnameIsValid ||
      !emailidIsValid ||
      !mobilenoIsValid ||
      !dobIsValid ||
      !passwordIsValid
    ) {
      setIsLoading(false);

      return;
    }

    const data = new FormData(event.currentTarget);

    const userData = {
      roleid: 3,
      loginid: data.get("loginid"),
      fullname: data.get("fullname"),
      createdby: "Self-Registered",
      emailid: data.get("emailid"),
      mobileno: data.get("mobileno"),
      dob: data.get("dob"),
      password: data.get("password"),
    };

    await register(userData)
      .then((res) => {
        window.scrollTo(0, 0);
        if (res.status_code === 201) {
          setIsLoading(false);
          setSuccess(res.message);
          setTimeout(() => {
            navigate("/violations");
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
      <Topbar>Sign Up</Topbar>
      <ThemeProvider theme={theme}>
        {isLoading && <Alert severity="info">Signing in...</Alert>}

        {!isLoading && success === "" && error !== "" && (
          <Alert severity="error">{error}</Alert>
        )}

        {!isLoading && success !== "" && (
          <Alert severity="success">{success}</Alert>
        )}
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
                value={loginid}
                onChange={loginidInputChangeHander}
                onBlur={loginidInputBlurHandler}
                error={loginidError}
                helperText={loginidError ? "Please enter username!" : " "}
                margin="normal"
                required
                fullWidth
                id="loginid"
                label="Username"
                type="text"
                name="loginid"
                autoComplete="loginid"
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
                value={emailid}
                onChange={emailidInputChangeHander}
                onBlur={emailidInputBlurHandler}
                error={emailidError}
                helperText={
                  emailidError ? "Please enter a valid email address!" : " "
                }
                margin="normal"
                required
                fullWidth
                name="emailid"
                label="Email address"
                type="emailid"
                id="emailid"
                autoComplete="emailid"
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

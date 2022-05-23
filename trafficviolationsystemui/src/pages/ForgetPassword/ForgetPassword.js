import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { resetPassword } from "../../libs/api";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import useInput from "../../hooks/use-input";
import Alert from "@mui/material/Alert";
import Topbar from "../../layouts/Topbar/Topbar";
import classes from "../../assets/Styling/Auth.module.css";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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

    if (!loginidIsValid || !passwordIsValid) {
      setIsLoading(false);

      return;
    }

    const data = new FormData(event.currentTarget);

    const passData = {
      loginid: data.get("loginid"),
      password: data.get("password"),
    };

    await resetPassword(passData)
      .then((res) => {
        if (res.status_code === 200) {
          setIsLoading(false);
          setSuccess(res.message);
          setTimeout(() => {
            navigate("/");
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
      <Topbar>Forget Password</Topbar>
      <ThemeProvider theme={theme}>
        {isLoading && <Alert severity="info">Loading...</Alert>}

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
              Reset Password
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
                Reset
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

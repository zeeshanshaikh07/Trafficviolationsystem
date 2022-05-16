import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { login } from "../../libs/api";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import useInput from "../../hooks/use-input";
import Topbar from "../../layouts/Topbar/Topbar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import classes from "../../assets/Styling/Auth.module.css";

const theme = createTheme();

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const {
    value: loginid,
    hasError: loginidError,
    valueIsValid: loginidIsValid,
    reset: loginidReset,
    inputChangeHander: loginidInputChangeHander,
    inputBlurHandler: loginidInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: password,
    hasError: passwordError,
    valueIsValid: passwordIsValid,
    reset: passwordReset,
    inputChangeHander: passwordInputChangeHander,
    inputBlurHandler: passwordInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!loginidIsValid || !passwordIsValid) {
      setIsLoading(false);
      return;
    }

    loginidReset();
    passwordReset();

    const data = new FormData(event.currentTarget);

    const userData = {
      loginid: data.get("loginid"),
      password: data.get("password"),
    };

    await login(userData)
      .then((res) => {
        if (res.status_code === 200) {
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
      <Topbar>Sign In</Topbar>
      <ThemeProvider theme={theme}>
        {isLoading && <Alert severity="info">Signing in...</Alert>}

        {!isLoading && success === "" && error !== "" && (
          <Alert severity="error">{error}</Alert>
        )}

        {!isLoading && success !== "" && (
          <Alert severity="success">{success}</Alert>
        )}

        <Container
          sx={{ mt: 3 }}
          className={classes.signin}
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
              Sign In
            </Typography>
            <Typography
              style={{
                fontSize: "15px",
              }}
              sx={{ mt: 3, mb: 3 }}
              component="h6"
              variant="h6"
            >
              Login to Traffic Violation System
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
                name="loginid"
                autoComplete="loginid"
                autoFocus
              />

              <TextField
                value={password}
                onChange={passwordInputChangeHander}
                onBlur={passwordInputBlurHandler}
                error={passwordError}
                helperText={passwordError ? "Please enter password!" : " "}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Grid container>
                <Grid
                  item
                  xs
                  sx={{
                    marginTop: 1,
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                </Grid>
                <Grid
                  item
                  sx={{
                    marginTop: 2,
                  }}
                >
                  <Link to="">Forgot password?</Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className={classes.btn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item sx={{ mb: 2 }}>
                  <Link to="/signup">Don't have an account? Sign Up</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

import { Link } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { Fragment } from "react";
import Topbar from "../../layouts/Topbar/Topbar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import classes from "../../assets/Styling/Auth.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function SignIn() {
  const {
    value: username,
    hasError: usernameError,
    valueIsValid: usernameIsValid,
    reset: usernameReset,
    inputChangeHander: usernameInputChangeHander,
    inputBlurHandler: usernameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: password,
    hasError: passwordError,
    valueIsValid: passwordIsValid,
    reset: passwordReset,
    inputChangeHander: passwordInputChangeHander,
    inputBlurHandler: passwordInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  // let formIsValid = false;

  // if (usernameIsValid && passwordIsValid) {
  //   formIsValid = true;
  // }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!usernameIsValid || !passwordIsValid) {
      return;
    }

    usernameReset();
    passwordReset();

    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      password: data.get("password"),
    });
  };

  return (
    <Fragment>
      <Topbar>Sign In</Topbar>
      <ThemeProvider theme={theme}>
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
                name="username"
                autoComplete="username"
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
                // disabled={!formIsValid}
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

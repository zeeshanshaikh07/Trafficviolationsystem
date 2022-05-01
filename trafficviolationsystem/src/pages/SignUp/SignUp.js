import * as React from "react";
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
  const [focus, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const handleSubmit = (event) => {
    event.preventDefault();
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
          sx={{ mt: 3 }}
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
                margin="normal"
                required
                fullWidth
                onFocus={onFocus}
                onBlur={onBlur}
                label="DOB"
                name="dob"
                type={focus ? "date" : "text"}
              />
              <TextField
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

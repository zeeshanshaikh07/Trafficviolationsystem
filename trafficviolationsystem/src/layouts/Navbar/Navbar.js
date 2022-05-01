import * as React from "react";
import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classes from "../../assets/Styling/Auth.module.css";
import navImg from "../../assets/Images/tvs.png";

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <Toolbar>
          <img src={navImg} alt="Traffic Violation System" />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{
              color: "#000",
              fontWeight: 700,
            }}
          >
            Traffic Violation System
          </Typography>
          <NavLink
            to={""}
            className={({ isActive }) =>
              isActive ? classes.activeClass : classes.notActiveClass
            }
          >
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? classes.activeClass : classes.notActiveClass
            }
          >
            Sign Up
          </NavLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

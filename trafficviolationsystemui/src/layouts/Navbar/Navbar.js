import * as React from "react";
import { Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classes from "../../assets/Styling/Auth.module.css";
import navImg from "../../assets/Images/tvs.png";
import Button from "@mui/material/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function ButtonAppBar() {
  const roleid = localStorage.getItem("roleid");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const navigate = useNavigate();

  let isNull;
  if (isLoggedIn === null) {
    isNull = true;
  } else {
    isNull = false;
  }

  const logOutHandler = () => {
    confirmAlert({
      title: "Confirm to logout",
      message: "Are you sure want to logout.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            localStorage.clear();
            navigate("");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

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
          {isNull && (
            <Fragment>
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
            </Fragment>
          )}

          {roleid === "3" && !isNull && (
            <Fragment>
              <NavLink
                to="/violations"
                className={({ isActive }) =>
                  isActive ? classes.activeClass : classes.notActiveClass
                }
              >
                Violations
              </NavLink>

              <NavLink
                to={"/vehicles"}
                className={({ isActive }) =>
                  isActive ? classes.activeClass : classes.notActiveClass
                }
              >
                Vehicles
              </NavLink>
              <NavLink
                to={"/profile"}
                className={({ isActive }) =>
                  isActive ? classes.activeClass : classes.notActiveClass
                }
              >
                Profile
              </NavLink>
              <Button
                sx={{ ml: 2 }}
                style={{
                  backgroundColor: "#313082",
                  float: "right",
                  border: "none",
                  color: "white",
                  textTransform: "none",
                }}
                variant="contained"
                onClick={logOutHandler}
              >
                Sign Out
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

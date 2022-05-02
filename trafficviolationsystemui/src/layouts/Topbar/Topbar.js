import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function ButtonAppBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#313082",
          height: "6rem",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{
              color: "#fff",
              fontSize: "40px",
              marginTop: "1rem",
            }}
          >
            {props.children}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BasicDetails from "./Basicdetails";
import Address from "./Address";
import { Fragment } from "react";
import Topbar from "../../layouts/Topbar/Topbar";
import ResetPassword from "./Resetpassword";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { getAddress } from "../../libs/api";

const theme = createTheme();

export default function Profile() {
  const [addressdata, setAddressdata] = React.useState([]);

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getAddress().then((data) => {
        if (data.length !== 0) {
          setAddressdata(data);
        }
      });
    }
    fetchVehicleData().catch((err) => {});
  }, []);

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Topbar>User Profile</Topbar>
        {localStorage.getItem("roleid") === "3" && (
          <Button
            style={{
              backgroundColor: "#313082",
              float: "right",
              border: "none",
              color: "white",
              borderRadius: "20px",
              padding: "10px 30px",
              marginRight: "30px",
              marginTop: "30px",
            }}
            variant="contained"
          >
            <Link
              style={{
                textDecoration: "none",
                color: "white",
              }}
              to="/addadress"
            >
              Add address
            </Link>
          </Button>
        )}

        <div
          style={{
            marginTop: "100px",
          }}
        >
          <BasicDetails></BasicDetails>

          {addressdata.map((add) => (
            <Address
              key={add.addressid}
              addressid={add.addressid}
              addresstype={add.addresstype}
              areaname={add.areaname}
              city={add.city}
              houseno={add.houseno}
              pincode={add.pincode}
              state={add.state}
            />
          ))}

          <ResetPassword></ResetPassword>
        </div>
      </ThemeProvider>
    </Fragment>
  );
}

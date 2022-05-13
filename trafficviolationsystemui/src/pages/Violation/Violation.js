import * as React from "react";
import { useEffect } from "react";
import { getViolations } from "../../libs/api";
import Topbar from "../../layouts/Topbar/Topbar";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Card from "../../layouts/Card/Card";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function createData(
  regnumber,
  city,
  violationname,
  violationdate,
  state,
  device,
  details
) {
  return {
    regnumber,
    city,
    violationname,
    violationdate,
    state,
    device,
    history: [details],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        onClick={() => setOpen(!open)}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell>{row.regnumber}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.violationname}</TableCell>
        <TableCell>{row.violationdate}</TableCell>
        <TableCell>{row.state}</TableCell>
        <TableCell>{row.device}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            style={{
              backgroundColor: "#313082",
              color: "#FFFFFF",
            }}
          >
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Violation Details
              </Typography>
              <Table
                style={{
                  color: "#FFFFFF",
                }}
                size="large"
                aria-label="violation details"
              >
                {row.history.map((history) => (
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      Violation Code:{history.violationcode}
                      &nbsp;
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      Longitude :&nbsp;{history.longitude}&nbsp;
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      Latitude :&nbsp;{history.latitude}
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      Violation Charges :{history.violationcharge}
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      Description :{history.description}
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{
                          backgroundColor: "#4CD137",
                          borderRadius: "20px",
                        }}
                      >
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    regnumber: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    violationname: PropTypes.string.isRequired,
    violationdate: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    device: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        violationcode: PropTypes.string.isRequired,
        longitude: PropTypes.string.isRequired,
        latitude: PropTypes.string.isRequired,
        violationcharge: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ),
  }),
};
const options = ["All", "Open", "Close"];
export default function Violation() {
  const [violations, setViolations] = React.useState([]);
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    async function fetchVehicleData() {
      await getViolations().then((data) => {
        setViolations(data);
        console.log("DATA", data);
      });
    }
    fetchVehicleData().catch((err) => {
      console.log(err);
    });
  }, []);

  const convertData = (d) => {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "-" + month + "-" + year;
  };

  const rows = [];
  console.log(violations);
  for (const key in violations) {
    console.log(violations[key].city);

    rows.push(
      createData(
        violations[key].regnumber,
        violations[key].city,
        violations[key].violationname,
        convertData(violations[key].violationdate),
        violations[key].state,
        violations[key].device,
        violations[key].violationdetails
      )
    );
  }
  // useEffect(() => {

  // }, [violations.length > 0]);

  return (
    <React.Fragment>
      <Topbar>View Violations</Topbar>
      <Card>
        <input
          type="text"
          name="search"
          value=""
          placeholder="Search..."
          style={{
            border: "1px solid #ccc",
            borderRadius: "20px",
            width: "20rem",
            height: "3rem",
            float: "right",
            maxWidth: "100%",
          }}
        />

        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Violation type" />
          )}
        />
        <TableContainer
          style={{
            marginTop: "50px",
          }}
          component={Paper}
        >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Reg.Number</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Violation Name</TableCell>
                <TableCell>Violation Date</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Device</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.regnumber} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </React.Fragment>
  );
}

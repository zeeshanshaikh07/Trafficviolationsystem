import * as React from "react";
import { useEffect } from "react";
import { getViolations } from "../../libs/api";
import Topbar from "../../layouts/Topbar/Topbar";
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
import Modal from "../../layouts/Modal/Modal";
import FormatDate from "../../utils/FormatDate";

function createData(
  key,
  regnumber,
  violationname,
  violationdate,
  charge,
  city,
  state,
  details
) {
  return {
    key,
    regnumber,
    violationname,
    violationdate,
    charge,
    city,
    state,
    violationdetails: [details],
  };
}

// const convertDate = (d) => {
//   let date = new Date(d);
//   let year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   let dt = date.getDate();

//   if (dt < 10) {
//     dt = "0" + dt;
//   }
//   if (month < 10) {
//     month = "0" + month;
//   }

//   return dt + "-" + month + "-" + year;
// };

const options = ["Open", "Close", "All"];

export default function Violation() {
  const [violations, setViolations] = React.useState([]);
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [isViolationEmpty, setIsViolationEmpty] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchVehicleData() {
      await getViolations().then((data) => {
        if (data.length !== 0) {
          setViolations(data);
          setIsViolationEmpty(false);
        } else {
          setIsViolationEmpty(true);
        }

        setIsLoading(false);
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      // setError(err.message);
      setError("Failed to fetch violations");
    });
  }, []);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow
          onClick={() => setOpen(!open)}
          sx={{ "& > *": { borderBottom: "unset" } }}
          style={{
            cursor: "pointer",
          }}
        >
          <TableCell>{row.regnumber}</TableCell>

          <TableCell>{row.violationname}</TableCell>
          <TableCell>{row.violationdate}</TableCell>
          <TableCell>Rs.{row.charge}</TableCell>
          <TableCell>{row.city}</TableCell>
          <TableCell>{row.state}</TableCell>
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
                  <TableBody>
                    {row.violationdetails.map((violationdetails) => (
                      <TableRow key={violationdetails.key}>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Violation Code:{violationdetails.violationcode}
                          &nbsp;
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Longitude :&nbsp;{violationdetails.longitude}&nbsp;
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Latitude :&nbsp;{violationdetails.latitude}
                        </TableCell>

                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Device type :{violationdetails.device}
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Description :{violationdetails.description}
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
                            onClick={handleClickOpen}
                          >
                            Pay
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const rows = [];

  for (const key in violations) {
    rows.push(
      createData(
        violations[key].key,
        violations[key].regnumber,
        violations[key].violationname,
        FormatDate(violations[key].violationdate),
        violations[key].charge,
        violations[key].city,
        violations[key].state,
        violations[key].violationdetails
      )
    );
  }

  const searchNSort = (
    <React.Fragment>
      <input
        type="text"
        name="search"
        placeholder="Search..."
        style={{
          border: "1px solid #ccc",
          borderRadius: "20px",
          width: "20rem",
          height: "2rem",
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
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Topbar>View Violations</Topbar>
      <Modal isOpen={open} handleClose={handleClose} title="Confirm Payment">
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h3>Amount : Rs.1000</h3>
          <h3>Date : 01-01-2022</h3>
          <h3>Violation Name : Over-Speeding</h3>
          <h3>Violation Code : s1c1234</h3>
        </div>
      </Modal>
      {isLoading && (
        <section
          style={{
            textAlign: "center",
            fontSize: "20px",
          }}
        >
          <p>Loading...</p>
        </section>
      )}
      {error && (
        <section
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "red",
          }}
        >
          <p>{error}</p>
        </section>
      )}
      {isViolationEmpty && (
        <section
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "green",
          }}
        >
          <p>No violation found.</p>
        </section>
      )}
      {!error && !isViolationEmpty && !isLoading && (
        <Card>
          {searchNSort}
          <TableContainer
            style={{
              marginTop: "50px",
            }}
            component={Paper}
          >
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle Reg No.</TableCell>
                  <TableCell>Violation Name</TableCell>
                  <TableCell>Violation Date</TableCell>
                  <TableCell>Violation Charge</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.key} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </React.Fragment>
  );
}

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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";

function createData(
  violationid,
  regnumber,
  violationname,
  violationdate,
  charge,
  city,
  state,
  details
) {
  return {
    violationid,
    regnumber,
    violationname,
    violationdate,
    charge,
    city,
    state,
    violationdetails: [details],
  };
}

const options = ["Open", "Close", "All"];

export default function Violation() {
  const [violations, setViolations] = React.useState([]);
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState("");
  const [charge, setCharge] = React.useState("");
  const [code, seCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [tvsid, setTvsid] = React.useState("");
  const [regno, setRegno] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [isViolationEmpty, setIsViolationEmpty] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (charge, id, code, name, date, regno) => {
    setOpen(true);
    setCharge(charge);
    setTvsid(id);
    seCode(code);
    setName(name);
    setDate(date);
    setRegno(regno);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    async function fetchVehicleData() {
      await getViolations(value).then((data) => {
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
      setError("Failed to fetch violations");
    });
  }, [value]);

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
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
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
                width: "113%",
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
                      <TableRow key={violationdetails.violationid}>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Violation Code:{violationdetails.violationcode}
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Longitude : {violationdetails.longitude}
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#FFFFFF",
                          }}
                        >
                          Latitude : {violationdetails.latitude}
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
                          {value === "Open" && (
                            <Button
                              fullWidth
                              variant="contained"
                              style={{
                                backgroundColor: "#4CD137",
                                borderRadius: "20px",
                              }}
                              onClick={() =>
                                handleClickOpen(
                                  violationdetails.charge,
                                  violationdetails.violationid,
                                  violationdetails.violationcode,
                                  violationdetails.violationname,
                                  violationdetails.violationdate,
                                  violationdetails.regnumber
                                )
                              }
                            >
                              Pay
                            </Button>
                          )}
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

  const searchValueHandler = (event) => {
    setSearchValue(event.target.value);
  };
  const rows = [];

  violations
    .filter((violation) =>
      violation.regnumber.match(new RegExp(searchValue, "i"))
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((violation) =>
      rows.push(
        createData(
          violation.violationid,
          violation.regnumber,
          violation.violationname,
          FormatDate(violation.violationdate),
          violation.charge,
          violation.city,
          violation.state,
          violation.violationdetails
        )
      )
    );

  const searchViolation = (
    <input
      type="text"
      name="search"
      value={searchValue}
      style={{
        border: "1px solid #ccc",
        borderRadius: " 4px",
        width: "20rem",
        height: "2rem",
        float: "right",
        maxWidth: "100%",
        marginTop: "-3.5rem",
      }}
      placeholder="Search..."
      onChange={searchValueHandler}
    />
  );

  const sortViolation = (
    <React.Fragment>
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
      <Modal
        isOpen={open}
        charge={charge}
        tvsid={tvsid}
        regno={regno}
        vname={name}
        handleClose={handleClose}
        title="Confirm Payment"
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h3>Amount : Rs.{charge}</h3>
          <h3>Date : {FormatDate(date)}</h3>
          <h3>Violation Name : {name}</h3>
          <h3>Violation Code : {code}</h3>
        </div>
      </Modal>

      <Card>
        {sortViolation}
        {searchViolation}
        <TableContainer
          style={{
            marginTop: "50px",
          }}
          component={Paper}
        >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell
                  style={{
                    fontWeight: "800",
                  }}
                >
                  Vehicle Reg No.
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "800",
                  }}
                >
                  Violation Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "800",
                  }}
                >
                  Violation Date
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "800",
                  }}
                >
                  Violation Charge
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "800",
                  }}
                >
                  City
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "800",
                  }}
                >
                  State
                </TableCell>
              </TableRow>
            </TableHead>
            {!error && !isViolationEmpty && !isLoading && (
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.violationid} row={row} />
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30, 40, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </React.Fragment>
  );
}

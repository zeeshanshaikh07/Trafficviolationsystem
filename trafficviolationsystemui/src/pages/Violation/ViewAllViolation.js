import * as React from "react";
import { getAllViolations, getAllDefaultViolations } from "../../libs/api";
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
import Card from "../../layouts/Card/Card";
import FormatDate from "../../utils/FormatDate";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import classes from "../../assets/Styling/Auth.module.css";
import useInput from "../../hooks/use-input";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
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
  status,
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
    status,
    city,
    state,
    violationdetails: [details],
  };
}
const options = ["state", "city"];
export default function Violation() {
  const [violations, setViolations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState();
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState("");
  const [isViolationEmpty, setIsViolationEmpty] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [displaySearch, setDisplaySearch] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const {
    value: filtervalue,
    hasError: filtervalueError,
    valueIsValid: filtervalueIsValid,
    reset: filtervalueReset,
    inputChangeHander: filtervalueInputChangeHander,
    inputBlurHandler: filtervalueInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getAllDefaultViolations().then((data) => {
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
  }, []);

  const handleSubmit = async (event) => {
    setDisplaySearch(true);
    event.preventDefault();
    setIsLoading(true);
    if (!filtervalueIsValid) {
      setIsLoading(false);
      return;
    }

    filtervalueReset();

    const data = new FormData(event.currentTarget);

    await getAllViolations(value, data.get("filtervalue"))
      .then((data) => {
        if (data.length !== 0) {
          setViolations(data);
          setIsViolationEmpty(false);
        } else {
          setIsViolationEmpty(true);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Failed to fetch violations");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
          <TableCell>{row.status}</TableCell>
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
                width: "125%",
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
          violation.status === 1 ? "Closed" : "Open",
          violation.city,
          violation.state,
          violation.violationdetails
        )
      )
    );

  const searchNSort = (
    <React.Fragment>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Autocomplete
              style={{
                marginTop: "15px",
              }}
              size="small"
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
              renderInput={(params) => <TextField {...params} label="Sort" />}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={filtervalue}
              onChange={filtervalueInputChangeHander}
              onBlur={filtervalueInputBlurHandler}
              error={filtervalueError}
              helperText={filtervalueError ? "Please enter value!" : " "}
              margin="normal"
              required
              fullWidth
              id="filtervalue"
              label="Name"
              name="filtervalue"
              autoComplete="filtervalue"
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2.3 }}
              className={classes.btn}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
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
      }}
      placeholder="Search Vehicle Reg No..."
      onChange={searchValueHandler}
    />
  );
  return (
    <React.Fragment>
      <Topbar>View Violations</Topbar>

      <Card>
        {searchNSort}
        {displaySearch && searchViolation}
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
                  Violation Status
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

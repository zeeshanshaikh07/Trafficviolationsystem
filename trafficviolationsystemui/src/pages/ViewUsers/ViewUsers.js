import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Topbar from "../../layouts/Topbar/Topbar";
import Card from "../../layouts/Card/Card";
import Button from "@mui/material/Button";
import { getAllUsers } from "../../libs/api";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const columns = [
  { id: "username", label: "Username", minWidth: 80 },
  { id: "fulname", label: "Fullname", minWidth: 80 },
  {
    id: "emailid",
    label: "Email Id",
    minWidth: 80,
  },
  {
    id: "mobileno",
    label: "Mobile No.",
    minWidth: 80,
  },
  {
    id: "role",
    label: "Role",
    minWidth: 80,
  },
  {
    id: "view",
    label: "View Details",
    minWidth: 80,
  },
  {
    id: "action",
    label: "Action",
    minWidth: 80,
  },
];

function createData(username, fulname, emailid, mobileno, role, view, action) {
  return { username, fulname, emailid, mobileno, role, view, action };
}

const options = ["Users", "Admins"];

export default function ViewUsers() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [isUserEmpty, setIsUserEmpty] = React.useState(false);
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    async function fetchVehicleData() {
      await getAllUsers(value).then((data) => {
        if (data.length !== 0) {
          setUsers(data);
          setIsUserEmpty(false);
        } else {
          setIsUserEmpty(true);
        }

        setIsLoading(false);
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, [value]);

  const rows = [];

  for (const key in users) {
    let role;
    if (users[key].roleid === 3) {
      role = "User";
    } else {
      role = "Admin";
    }
    rows.push(
      createData(
        users[key].loginid,
        users[key].fullname,
        users[key].emailid,
        users[key].mobileno,
        role,
        <Button variant="contained">View</Button>,
        <Button variant="outlined">Enable</Button>
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
          marginBottom: "50px",
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
        renderInput={(params) => <TextField {...params} label="Type" />}
      />
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Topbar>Users List</Topbar>
      <Card>
        {searchNSort}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {!error && !isUserEmpty && !isLoading && (
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
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
          {isUserEmpty && (
            <section
              style={{
                textAlign: "center",
                fontSize: "20px",
                color: "red",
              }}
            >
              <p>No User found.</p>
            </section>
          )}
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Card>
    </React.Fragment>
  );
}
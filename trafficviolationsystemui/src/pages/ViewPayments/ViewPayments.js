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

const columns = [
  { id: "vehicleregno", label: "Vehicle Registration No.", minWidth: 80 },
  { id: "transactionstatus", label: "Transaction Status", minWidth: 80 },
  {
    id: "violationid",
    label: "Violation Id",
    minWidth: 80,
  },
  {
    id: "amount",
    label: "Amount",
    minWidth: 80,
  },
  {
    id: "paymentmode",
    label: "Payment Mode",
    minWidth: 80,
  },
];

function createData(
  vehicleregno,
  transactionstatus,
  violationid,
  amount,
  paymentmode
) {
  return { vehicleregno, transactionstatus, violationid, amount, paymentmode };
}

export default function ViewPayments() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = [createData("MH24BE1234", "Success", "1", "1000", "NB")];

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
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Topbar>User Payment</Topbar>
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
            </Table>
          </TableContainer>

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

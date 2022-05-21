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
import { useParams } from "react-router-dom";
import { getUserPayment } from "../../libs/api";
import FormatDate from "../../utils/FormatDate";

const columns = [
  { id: "vehicleregno", label: "Vehicle Registration No.", minWidth: 80 },
  { id: "transactionstatus", label: "Transaction Status", minWidth: 80 },
  {
    id: "violationname",
    label: "Violation Name",
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
  {
    id: "date",
    label: "Date",
    minWidth: 80,
  },
];

function createData(
  vehicleregno,
  transactionstatus,
  violationname,
  amount,
  paymentmode,
  date
) {
  return {
    vehicleregno,
    transactionstatus,
    violationname,
    amount,
    paymentmode,
    date,
  };
}

export default function ViewPayments() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [payments, setPayments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [isPayEmpty, setIsUserEmpty] = React.useState(false);

  const params = useParams();
  const { loginid } = params;

  console.log(loginid);

  React.useEffect(() => {
    async function fetchPaymentData() {
      await getUserPayment(loginid).then((data) => {
        if (data.length !== 0) {
          setPayments(data);
          setIsUserEmpty(false);
        } else {
          setIsUserEmpty(true);
        }

        setIsLoading(false);
      });
    }
    fetchPaymentData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, [loginid]);

  const rows = [];

  for (const key in payments) {
    let status;
    if (payments[key].transactionstatus === 0) {
      status = "Failed";
    } else {
      status = "Success";
    }
    rows.push(
      createData(
        payments[key].vehicleregno,
        status,
        payments[key].violationname,
        payments[key].amount,
        payments[key].paymentmode,
        FormatDate(payments[key].transactiondate)
      )
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
              {!error && !isPayEmpty && !isLoading && (
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
          {isPayEmpty && (
            <section
              style={{
                textAlign: "center",
                fontSize: "20px",
                color: "red",
              }}
            >
              <p>No Payment found.</p>
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

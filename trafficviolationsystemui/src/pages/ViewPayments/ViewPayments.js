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
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [payments, setPayments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [isPayEmpty, setIsUserEmpty] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const params = useParams();
  const { loginid } = params;

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

  const searchValueHandler = (event) => {
    setSearchValue(event.target.value);
  };

  const rows = [];

  payments
    .filter((payment) =>
      payment.vehicleregno.match(new RegExp(searchValue, "i"))
    )
    .map((payment) =>
      rows.push(
        createData(
          payment.vehicleregno,
          payment.transactionstatus === 0 ? "Failed" : "Success",
          payment.violationname,
          payment.amount,
          payment.paymentmode,
          FormatDate(payment.transactiondate)
        )
      )
    );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const searchPayment = (
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
        marginBottom: "2rem",
      }}
      placeholder="Search..."
      onChange={searchValueHandler}
    />
  );

  return (
    <React.Fragment>
      <Topbar>User Payment</Topbar>
      <Card>
        {searchPayment}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight: "800" }}
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
            rowsPerPageOptions={[5, 10, 20, 30, 40, 50]}
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

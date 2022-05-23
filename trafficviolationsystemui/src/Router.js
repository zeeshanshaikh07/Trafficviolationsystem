import { Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Vehicle from "./pages/Vehicle/Vehicle";
import ViewUserVehicle from "./pages/Vehicle/ViewUserVehicle";
import VehicleSummary from "./pages/Vehicle/VehicleSummary";
import Navbar from "./layouts/Navbar/Navbar";
import Footer from "./layouts/Footer/Footer";
import ViewAllViolation from "./pages/Violation/ViewAllViolation";
import Violation from "./pages/Violation/Violation";
import PaymentSuccess from "./pages/PaymentResponse/PaymentSuccess";
import PaymentFailure from "./pages/PaymentResponse/PaymentFailure";
import Profile from "./pages/Profile/Profile";
import AddAddress from "./pages/Profile/AddAddress";
import ViewUsers from "./pages/ViewUsers/ViewUsers";
import ViewSingleUser from "./pages/ViewUsers/ViewSingleUser";
import ViewPayments from "./pages/ViewPayments/ViewPayments";
import AddUser from "./pages/AddUser/AddUser";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";

function Router() {
  const isAuthenticated = !!localStorage.getItem("token");
  const role = localStorage.getItem("roleid");

  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/vehicles"
          element={
            isAuthenticated && role === "3" ? <Vehicle /> : <Navigate to="/" />
          }
        />
        <Route
          path="/vehicles/:vehicleregno"
          element={isAuthenticated ? <VehicleSummary /> : <Navigate to="/" />}
        />
        <Route
          path="/violations"
          element={
            isAuthenticated && role === "3" ? (
              <Violation />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/paymentsuccess"
          element={
            isAuthenticated && role === "3" ? (
              <PaymentSuccess />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/paymentfailure"
          element={
            isAuthenticated && role === "3" ? (
              <PaymentFailure />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/addadress"
          element={
            isAuthenticated && role === "3" ? (
              <AddAddress />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/viewusers"
          element={isAuthenticated ? <ViewUsers /> : <Navigate to="/" />}
        />
        <Route
          path="/viewusers/:loginid"
          element={isAuthenticated ? <ViewSingleUser /> : <Navigate to="/" />}
        />
        <Route
          path="/viewpayments/:loginid"
          element={isAuthenticated ? <ViewPayments /> : <Navigate to="/" />}
        />

        <Route
          path="/viewuservehicle/:loginid"
          element={isAuthenticated ? <ViewUserVehicle /> : <Navigate to="/" />}
        />

        <Route
          path="/adduser"
          element={isAuthenticated ? <AddUser /> : <Navigate to="/" />}
        />

        <Route path="/forgetpassword" element={<ForgetPassword />} />

        <Route
          path="/allviolations"
          element={isAuthenticated ? <ViewAllViolation /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default Router;

import { Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Vehicle from "./pages/Vehicle/Vehicle";
import VehicleSummary from "./pages/Vehicle/VehicleSummary";
import Navbar from "./layouts/Navbar/Navbar";
import Violation from "./pages/Violation/Violation";
import PaymentSuccess from "./pages/PaymentResponse/PaymentSuccess";
import PaymentFailure from "./pages/PaymentResponse/PaymentFailure";
import Profile from "./pages/Profile/Profile";
import AddAddress from "./pages/Profile/AddAddress";
import ViewUsers from "./pages/ViewUsers/ViewUsers";
import ViewPayments from "./pages/ViewPayments/ViewPayments";

function Router() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/vehicles"
          element={isAuthenticated ? <Vehicle /> : <Navigate to="/" />}
        />
        <Route
          path="/vehicles/:vehicleregno"
          element={isAuthenticated ? <VehicleSummary /> : <Navigate to="/" />}
        />
        <Route
          path="/violations"
          element={isAuthenticated ? <Violation /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/paymentsuccess"
          element={isAuthenticated ? <PaymentSuccess /> : <Navigate to="/" />}
        />
        <Route
          path="/paymentfailure"
          element={isAuthenticated ? <PaymentFailure /> : <Navigate to="/" />}
        />
        <Route
          path="/addadress"
          element={isAuthenticated ? <AddAddress /> : <Navigate to="/" />}
        />

        <Route
          path="/viewusers"
          element={isAuthenticated ? <ViewUsers /> : <Navigate to="/" />}
        />
        <Route
          path="/viewpayments"
          element={isAuthenticated ? <ViewPayments /> : <Navigate to="/" />}
        />
      </Routes>
    </Fragment>
  );
}

export default Router;

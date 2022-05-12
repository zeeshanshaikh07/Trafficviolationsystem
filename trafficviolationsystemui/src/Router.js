import { Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Vehicle from "./pages/Vehicle/Vehicle";
import Navbar from "./layouts/Navbar/Navbar";

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
      </Routes>
    </Fragment>
  );
}

export default Router;

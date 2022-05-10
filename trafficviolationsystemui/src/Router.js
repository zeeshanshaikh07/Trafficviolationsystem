import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Vehicle from "./pages/Vehicle/Vehicle";
import Navbar from "./layouts/Navbar/Navbar";

function Router() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/vehicles" element={<Vehicle />} />
      </Routes>
    </Fragment>
  );
}

export default Router;

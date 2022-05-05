import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import AddVehicle from "./pages/AddVehicle/AddVehicle";
import Navbar from "./layouts/Navbar/Navbar";

function Router() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addvehicle" element={<AddVehicle />} />
      </Routes>
    </Fragment>
  );
}

export default Router;

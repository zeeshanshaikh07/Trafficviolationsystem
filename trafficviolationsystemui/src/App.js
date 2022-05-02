import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Navbar from "./layouts/Navbar/Navbar";
import "./App.css";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Fragment>
  );
}

export default App;

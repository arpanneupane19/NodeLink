import React from "react";
import { Redirect } from "react-router-dom";

function Logout() {
  let loggingOut = true;
  localStorage.removeItem("token");
  if (loggingOut) {
    return <Redirect to="/login" />;
  }
}

export default Logout;

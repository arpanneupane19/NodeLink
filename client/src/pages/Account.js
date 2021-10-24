import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { LoggedInNavbar } from "../components/Navbar";

function Account() {
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    axios
      .get("/account", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }
      });
  }, []);

  if (!loggedIn) {
    localStorage.removeItem("token");
    return <Redirect to="/login" />;
  }
  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <h1>Account</h1>
    </div>
  );
}

export default Account;

import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

function Menu(props) {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = () => {
    axios.get("/api/logout").then((response) => {
      if (response.data.message === "Logging out") {
        localStorage.removeItem("token");
        setLoggingOut(true);
      }
    });
  };

  if (loggingOut) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="bg-white z-[100]">
      {props.state === "logged out" ? (
        <ul className="flex flex-col justify-center items-center">
          <Link to="/login" className="p-2 mb-2">
            Login
          </Link>
          <Link
            to="/register"
            className="mb-2 bg-green-400 p-2 rounded-xl text-white hover:bg-green-600"
          >
            Register
          </Link>
        </ul>
      ) : (
        <ul className="flex flex-col justify-center items-center">
          <Link to="/dashboard" className="p-2 mb-2">
            Dashboard
          </Link>
          <Link to="/create-link" className="p-2 mb-2">
            Create Link
          </Link>
          <Link to="/analytics" className="p-2 mb-2">
            Analytics
          </Link>
          <Link to="/account" className="p-2 mb-2">
            Account
          </Link>
          <button
            className="mb-2 bg-green-400 p-2 rounded-xl text-white hover:bg-green-600"
            onClick={() => logout()}
          >
            Logout
          </button>
        </ul>
      )}
    </div>
  );
}

export default Menu;

import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

export function Navbar() {
  return (
    <nav className="navbar bg-white flex md:flex-row flex-col justify-between items-center py-4 px-6 font-sans antialiased tracking-wider">
      <div className="branding md:text-2xl text-xl">
        <Link to="/" className="flex">
          <p>NodeLink</p>
        </Link>
      </div>
      <ul className="flex flex-center md:mt-0 mt-3 md:text-lg text-base">
        <Link to="/login" className="mx-3 p-2">
          Login
        </Link>
        <Link
          to="/register"
          className="mx-3 bg-green-500 p-2 rounded-xl text-white hover:bg-green-600"
        >
          Register
        </Link>
      </ul>
    </nav>
  );
}

export function LoggedInNavbar() {
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
    <nav className="navbar bg-white flex md:flex-row flex-col justify-between items-center py-4 px-6 font-sans antialiased tracking-wider">
      <div className="branding md:text-2xl text-xl">
        <Link to="/dashboard" className="flex">
          <p>NodeLink</p>
        </Link>
      </div>
      <ul className="flex flex-center md:mt-0 mt-3 md:text-lg text-base">
        <Link to="/dashboard" className="mx-3 p-2">
          Dashboard
        </Link>
        <Link to="/create-link" className="mx-3 p-2">
          Create Link
        </Link>
        <Link to="/analytics" className="mx-3 p-2">
          Analytics
        </Link>
        <Link to="/account" className="mx-3 p-2">
          Account
        </Link>
        <button
          className="mx-3 bg-green-500 p-2 rounded-xl text-white hover:bg-green-600"
          onClick={() => logout()}
        >
          Logout
        </button>
      </ul>
    </nav>
  );
}

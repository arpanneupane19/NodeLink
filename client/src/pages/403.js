import React from "react";
import { LoggedInNavbar, Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

function Forbidden() {
  return (
    <div className="font-sans antialiased bg-white">
      {localStorage.getItem("token") ? <LoggedInNavbar /> : <Navbar />}
      <div className="flex flex-col justify-center items-center text-center md:pt-36 pt-24 mx-4">
        <div className="form w-full md:w-1/2">
          <div className="tracking-wider mb-10">
            <h1 className="md:text-3xl text-2xl mb-2">403</h1>
            <p>You do not have permission to do that.</p>
            <br></br>
            {localStorage.getItem("token") ? (
              <Link className="text-blue-500" to="/dashboard">
                Return to dashboard.
              </Link>
            ) : (
              <Link className="text-blue-500" to="/home">
                Return to home.
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forbidden;

import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { LoggedInNavbar } from "../components/Navbar";

function ChangePassword() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [currentPasswordMatch, setCurrentPasswordMatch] = useState(true);

  useEffect(() => {
    axios
      .get("/api/change-password", {
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

  const sendPostReq = (event) => {
    event.preventDefault();
    setPasswordUpdated(false);
    setCurrentPasswordMatch(true);

    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    axios
      .post(
        "/api/change-password",
        { data },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }

        if (response.data.passwordUpdated) {
          setPasswordUpdated(true);
          setCurrentPassword("");
          setNewPassword("");
        }

        if (response.data.passwordUpdated === false) {
          setCurrentPasswordMatch(false);
          setCurrentPassword("");
          setNewPassword("");
        }
      });
  };

  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24 mx-6">
        <div className="form md:w-3/4 w-full">
          <div className="tracking-wider mb-10">
            <h1 className="text-2xl tracking-widest mb-2">Change Password</h1>
            {passwordUpdated ? (
              <div className="flex flex-col">
                <span>Your password has successfully been updated!</span>
                <Link to="/account" className="mt-2 text-blue-500">
                  Back to account
                </Link>
              </div>
            ) : (
              <></>
            )}
            {!currentPasswordMatch ? (
              <>
                <span>
                  Current password is invalid. Please enter in the correct
                  current password to proceed.
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
          <form onSubmit={sendPostReq}>
            <input
              type="password"
              min="8"
              placeholder="Current Password"
              name="current-password"
              id="current-password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              value={currentPassword}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <input
              type="password"
              min="8"
              placeholder="New Password"
              name="new-password"
              id="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <button
              type="submit"
              className="p-4 bg-green-400 text-white rounded-xl"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

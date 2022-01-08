import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ResetPassword() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }

    axios.get(`/api/reset-password/${token}`).then((response) => {
      if (response.data.message !== "User valid") {
        setInvalidUser(true);
      }
      if (response.data.message === "User valid") {
        if (response.data.userEmail) {
          setUserEmail(response.data.userEmail);
        }
      }
    });
  }, [token]);

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  const sendPostReq = (event) => {
    event.preventDefault();

    const data = {
      newPassword: newPassword,
    };

    axios.post(`/api/reset-password/${token}`, { data }).then((response) => {
      if (response.data.passwordUpdated) {
        setPasswordUpdated(true);
        setNewPassword("");
      }
      if (response.data.passwordUpdated === false) {
        setPasswordUpdated(false);
      }
    });
  };
  return (
    <div className="font-sans antialiased bg-white">
      <Navbar />

      {invalidUser ? (
        <div className="flex flex-col justify-center items-center text-center md:pt-36 pt-24 mx-4">
          <div className="form w-full md:w-1/2">
            <div className="tracking-wider mb-10">
              <h1 className="md:text-3xl text-2xl mb-2">Invalid Token</h1>
              <p>The token passed in the URL is not valid.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center md:mt-16 mt-12 mx-6">
          <div className="form w-full md:w-1/2">
            <div className="tracking-wider mb-8">
              <h1 className="md:text-3xl text-2xl mb-2">Reset Password</h1>
              {passwordUpdated ? (
                <div className="flex flex-col">
                  <span>
                    Your password has successfully been reset! You can log in
                    now.{" "}
                  </span>
                  <Link to="/login" className="mt-2 text-blue-500">
                    Go to login
                  </Link>
                </div>
              ) : (
                <>
                  <span>
                    The password that you enter in will be the new password for{" "}
                    {userEmail}'s account.
                  </span>
                </>
              )}
            </div>
            <form onSubmit={sendPostReq}>
              <input
                type="password"
                min="7"
                max="320"
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
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;

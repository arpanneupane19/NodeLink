import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Redirect } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidUser, setInvalidUser] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  const sendPostReq = (event) => {
    event.preventDefault();
    setInvalidUser(false);
    setEmailSent(false);

    const data = {
      email: email,
      frontendURL: document.location.origin,
    };

    axios.post("/api/forgot-password", { data }).then((response) => {
      if (response.data.userValid) {
        setEmailSent(true);
      }
      if (response.data.userValid === false) {
        setInvalidUser(true);
      }
    });
  };

  return (
    <div className="font-sans antialiased bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center md:mt-16 mt-12 mx-6">
        <div className="form w-full md:w-1/2">
          <div className="tracking-wider mb-8">
            <h1 className="md:text-3xl text-2xl mb-2">Forgot your password?</h1>
            {!invalidUser && !emailSent ? (
              <span>
                We'll send you a link to reset your password to your inbox.
              </span>
            ) : (
              <>
                {emailSent ? (
                  <span>
                    An email has been sent to reset your password. If it does
                    not appear in your inbox, please check your spam.
                  </span>
                ) : (
                  <></>
                )}
                {invalidUser ? (
                  <span>
                    There is no user associated with that email address.
                  </span>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
          <form onSubmit={sendPostReq}>
            <input
              type="email"
              min="7"
              max="320"
              placeholder="Email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <button
              type="submit"
              className="p-4 bg-green-400 text-white rounded-xl"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

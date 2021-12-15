import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [accountDoesNotExist, setAccountDoesNotExist] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);
  const sendPostReq = (event) => {
    event.preventDefault();

    const user = {
      username: username,
      password: password,
    };

    axios.post("/api/login", { user }).then((response) => {
      if (response.data.message === "Verification successful") {
        // Log user in
        localStorage.setItem("token", response.data.token);
        setLoggedIn(true);
      }
      if (response.data.message === "Password is invalid") {
        setInvalidPassword(true);
        setAccountDoesNotExist(false);
        setPassword("");
      }
      if (response.data.message === "This account does not exist") {
        setAccountDoesNotExist(true);
        setInvalidPassword(false);
        setUsername("");
        setPassword("");
      }
    });
  };

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="font-sans antialiased bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24 mx-6">
        <div className="form w-full md:w-1/2">
          <div className="tracking-wider mb-10">
            {invalidPassword || accountDoesNotExist ? (
              <h1 className="md:text-3xl text-2xl mb-2">Log In to NodeLink</h1>
            ) : (
              <h1 className="md:text-3xl text-2xl">Log In to NodeLink</h1>
            )}

            {invalidPassword ? (
              <>
                <span>Password is incorrect.</span>
                <br></br>
              </>
            ) : (
              <></>
            )}

            {accountDoesNotExist ? (
              <span>This account does not exist.</span>
            ) : (
              <></>
            )}
          </div>
          <form onSubmit={sendPostReq}>
            <input
              type="text"
              min="4"
              max="20"
              placeholder="Username"
              name="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <input
              type="password"
              min="8"
              placeholder="Password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <div className="flex flex-col mb-4">
              <span className="mb-1">
                Forgot your password? Click{" "}
                <Link
                  className="underline hover:no-underline"
                  to="/forgot-password"
                >
                  here
                </Link>{" "}
                to reset it.
              </span>
              <span>
                Don't have an account?{" "}
                <Link className="underline hover:no-underline" to="/register">
                  Sign up
                </Link>{" "}
                now.
              </span>
            </div>
            <button
              type="submit"
              className="p-4 bg-green-400 text-white rounded-xl"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { LoggedInNavbar } from "../components/Navbar";

function Account() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [accountUpdated, setAccountUpdated] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    axios
      .get("/api/account", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }
        if (response.data.message === "Logged in") {
          if (
            response.data.firstName &&
            response.data.lastName &&
            response.data.username &&
            response.data.email
          ) {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setUsername(response.data.username);
            setEmail(response.data.email);
          }

          if (response.data.bio.trim() === "") {
            setBio("");
          }
          if (response.data.bio.trim() !== "") {
            setBio(response.data.bio);
          }
          setImgUrl(`/api/get-profile-picture/${response.data.username}`);
        }
      });
  }, []);

  if (!loggedIn) {
    localStorage.removeItem("token");
    return <Redirect to="/login" />;
  }

  const sendPostReq = (event) => {
    event.preventDefault();

    setAccountUpdated(false);
    setAlreadyExists(false);

    const data = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      bio: bio,
    };

    axios
      .post(
        "/api/account",
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

        if (response.data.accountUpdated) {
          setAccountUpdated(true);
        }

        if (!response.data.accountUpdated) {
          if (
            response.data.error === "Username or email belongs to another user."
          ) {
            setAlreadyExists(true);
          }
        }
      });
  };

  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24 mx-6">
        <div className="form md:w-3/4 w-full">
          <div className="tracking-wider mb-6">
            <h1 className="text-2xl tracking-widest mb-2">My Account</h1>
            <img
              src={imgUrl}
              alt="Profile"
              className="rounded-full mt-4 mb-4"
              width="100"
            />
            {alreadyExists ? (
              <>
                <span>
                  Username or email already exists. Please choose a different
                  one.
                </span>
              </>
            ) : (
              <></>
            )}

            {accountUpdated ? (
              <>
                <span>Your account has successfully been updated!</span>
              </>
            ) : (
              <></>
            )}
          </div>
          <form onSubmit={sendPostReq}>
            <div className="w-full flex justify-center items-center">
              <input
                type="text"
                min="4"
                max="20"
                placeholder="First Name"
                name="username"
                id="username"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="w-1/2 mr-1 p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
                required
              />
              <input
                type="text"
                min="4"
                max="30"
                placeholder="Last Name"
                name="username"
                id="username"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="w-1/2 ml-1 p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
                required
              />
            </div>
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
            <textarea
              type="text"
              min="4"
              max="500"
              placeholder="Bio"
              name="bio"
              id="bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              className="w-full max-h-56 p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              style={{ minHeight: "90px" }}
            ></textarea>
            <div className="flex flex-col items-start mb-4">
              <span>
                Want to update your profile picture? Click{" "}
                <Link
                  to="/update-profile-picture"
                  className="underline hover:no-underline"
                >
                  here
                </Link>
                .
              </span>
              <span>
                Want to change your password? Click{" "}
                <Link
                  className="underline hover:no-underline"
                  to="/change-password"
                >
                  here
                </Link>
                .
              </span>
            </div>
            <button
              type="submit"
              className="p-4 bg-green-400 text-white rounded-xl"
            >
              Update Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { LoggedInNavbar } from "../components/Navbar";

function CreateLink() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [linkCreated, setLinkCreated] = useState(false);

  useEffect(() => {
    axios
      .get("/api/create-link", {
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

    const link = {
      linkName: linkName,
      linkURL: linkURL,
    };

    const token = localStorage.getItem("token");

    axios
      .post(
        "/api/create-link",
        { link },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }
        if (response.data.linkCreated) {
          setLinkCreated(true);
        }
      });
  };

  if (linkCreated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24 mx-6">
        <div className="form w-full md:w-1/2">
          <div className="tracking-wider mb-10">
            <h1 className="md:text-3xl text-2xl mb-2">Create Link</h1>
          </div>
          <form onSubmit={sendPostReq}>
            <input
              type="text"
              min="4"
              max="50"
              placeholder="Link Name"
              name="linkName"
              id="linkName"
              onChange={(e) => setLinkName(e.target.value)}
              value={linkName}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <input
              type="url"
              placeholder="Link URL (https://example.com)"
              name="linkURL"
              id="linkURL"
              onChange={(e) => setLinkURL(e.target.value)}
              value={linkURL}
              className="w-full p-4 border border-gray-100 bg-gray-100 rounded-xl focus:border-gray-100 focus:outline-none focus:bg-white tracking-wide mb-4"
              required
            />
            <button
              type="submit"
              className="p-4 bg-green-400 text-white rounded-xl"
            >
              Create Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLink;

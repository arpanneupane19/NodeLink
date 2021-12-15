import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInNavbar } from "../components/Navbar";

function CreateLink() {
  const { linkId } = useParams();

  const [loggedIn, setLoggedIn] = useState(true);
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [linkEdited, setLinkEdited] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/edit-link/${linkId}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }

        if (response.data.forbidden === "Cannot do that") {
          setForbidden(true);
        }

        if (response.data.notFound === "404 not found") {
          setNotFound(true);
        }

        if (response.data.link) {
          setLinkName(response.data.link.linkName);
          setLinkURL(response.data.link.linkURL);
        }
      });
  }, [linkId]);

  const sendPostReq = (event) => {
    event.preventDefault();

    const link = {
      linkId: linkId,
      linkName: linkName,
      linkURL: linkURL,
    };

    const token = localStorage.getItem("token");

    axios
      .post(
        `/api/edit-link/${linkId}`,
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
        if (response.data.linkUpdated) {
          setLinkEdited(true);
        }
        if (response.data.forbidden === "Cannot do that") {
          setForbidden(true);
        }

        if (response.data.notFound === "404 not found") {
          setNotFound(true);
        }
      });
  };

  if (!loggedIn) {
    localStorage.removeItem("token");
    return <Redirect to="/login" />;
  }

  if (forbidden) {
    return <Redirect to="/403-forbidden" />;
  }

  if (notFound) {
    return <Redirect to="/404-page-not-found" />;
  }

  if (linkEdited) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24 mx-6">
        <div className="form w-full md:w-1/2">
          <div className="tracking-wider mb-10">
            <h1 className="md:text-3xl text-2xl mb-2">Edit Link</h1>
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
              Update Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLink;

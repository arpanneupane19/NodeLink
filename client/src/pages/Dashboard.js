import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { LoggedInNavbar } from "../components/Navbar";

function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [links, setLinks] = useState([{}]);
  const [linkDeleted, setLinkDeleted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [currentUser, setCurrentUser] = useState([{}]);

  useEffect(() => {
    axios
      .get("/api/dashboard", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }
        if (response.data.links) {
          setLinks(response.data.links);
        }
        if (response.data.user) {
          setCurrentUser(response.data.user);
        }
      });
  }, [linkDeleted]);

  const deleteLink = (linkId) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `/api/delete-link/${linkId}`,
        { linkId },
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
        if (response.data.linkDeleted) {
          setLinkDeleted(true);
        }
        if (response.data.forbidden === "Cannot do that") {
          setForbidden(true);
        }

        if (response.data.notFound === "404 not found") {
          setNotFound(true);
        }
        setLinkDeleted(false);
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

  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col md:pt-36 pt-24 mx-8">
        <div className="flex flex-col">
          <div className="mb-8 flex flex-col">
            <h1 className="text-2xl mb-2 tracking-widest">DASHBOARD</h1>
            <div>
              {currentUser !== "undefined" ? (
                <Link
                  to={{ pathname: `/${currentUser.username}` }}
                  className="text-blue-500 mb-1"
                >
                  View my NodeLink website.
                </Link>
              ) : (
                <></>
              )}
            </div>
            <div>
              <Link to="/edit-site" className="text-blue-500">
                Edit my site's appearance.
              </Link>
            </div>
          </div>
          <div className="links flex flex-wrap">
            {typeof links !== "undefined" ? (
              links.length > 0 ? (
                links.map((link, index) => (
                  <div
                    key={index}
                    className="link w-full md:my-4 my-2 p-6 shadow-xl rounded-xl bg-green-400 text-white"
                  >
                    <div className="flex justify-between items-center">
                      <a href={link.linkURL} target="__blank">
                        {link.linkName}
                      </a>
                      <div className="flex justify-center items-center">
                        <Link
                          className="mx-2"
                          to={{ pathname: `/edit-link/${link.id}` }}
                        >
                          <FiEdit />
                        </Link>
                        <button onClick={() => deleteLink(link.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>You have no links at the moment.</p>
              )
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { LoggedInNavbar } from "../components/Navbar";

function Analytics() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [views, setViews] = useState("Loading...");

  useEffect(() => {
    axios
      .get("/api/analytics", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }
        setViews(response.data.views);
      });
  }, []);

  if (!loggedIn) {
    localStorage.removeItem("token");
    return <Redirect to="/login" />;
  }
  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col md:pt-36 pt-24 mx-8">
        <div className="flex flex-col">
          <div className="mb-8 flex flex-col">
            <h1 className="text-2xl mb-6 tracking-widest">My Analytics</h1>
            <div className="p-8 bg-green-400 rounded-xl shadow-xl text-white tracking-wide">
              <div className="flex">
                <p className="mr-1 font-bold">Views: </p>
                <p>{views}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

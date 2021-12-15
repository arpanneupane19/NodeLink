import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { LoggedInNavbar } from "../components/Navbar.js";

function EditSite() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [siteBgColor, setSiteBgColor] = useState("");
  const [linkBgColor, setLinkBgColor] = useState("");
  const [linkColor, setLinkColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [siteUpdated, setSiteUpdated] = useState(false);

  useEffect(() => {
    axios
      .get("/api/edit-site", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.message !== "Logged in") {
          setLoggedIn(false);
        }

        if (response.data.siteConfig) {
          setSiteBgColor(response.data.siteConfig.bgColor);
          setLinkBgColor(response.data.siteConfig.linkBgColor);
          setLinkColor(response.data.siteConfig.linkColor);
          setTextColor(response.data.siteConfig.textColor);
        }
      });
  }, []);

  if (!loggedIn) {
    localStorage.removeItem("token");
    return <Redirect to="/login" />;
  }

  const sendPostReq = (event) => {
    event.preventDefault();

    const siteConfig = {
      bgColor: siteBgColor,
      linkBgColor: linkBgColor,
      linkColor: linkColor,
      textColor: textColor,
    };

    axios
      .post(
        "/api/edit-site",
        { siteConfig },
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
        if (response.data.siteUpdated) {
          setSiteUpdated(true);
        }
      });
  };

  return (
    <div className="font-sans antialiased bg-white">
      <LoggedInNavbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24 mx-6">
        <div className="form md:w-3/4 w-full">
          <div className="tracking-wider mb-10">
            <h1 className="text-2xl mb-2 tracking-widest mb-2">Edit My Site</h1>
            {siteUpdated ? (
              <>
                <span>Your site settings have successfully been updated!</span>
              </>
            ) : (
              <></>
            )}
          </div>
          <form onSubmit={sendPostReq}>
            <div className="w-full flex-col justify-center items-center">
              <div className="flex flex-col p-4 bg-gray-100 rounded-xl mb-6">
                <div className="flex flex-col mb-6">
                  <label className="mb-2">Site Background Color</label>
                  <input
                    type="color"
                    name="siteBgColor"
                    id="siteBgColor"
                    value={siteBgColor}
                    onChange={(e) => setSiteBgColor(e.target.value)}
                    className="w-full bg-transparent"
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <label className="mb-2">Link Background Color</label>
                  <input
                    type="color"
                    name="linkBgColor"
                    id="linkBgColor"
                    value={linkBgColor}
                    onChange={(e) => setLinkBgColor(e.target.value)}
                    className="w-full bg-transparent"
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <label className="mb-2">Link Color</label>
                  <input
                    type="color"
                    name="linkColor"
                    id="linkColor"
                    value={linkColor}
                    onChange={(e) => setLinkColor(e.target.value)}
                    className="w-full bg-transparent"
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2">Text Color</label>
                  <input
                    type="color"
                    name="textColor"
                    id="textColor"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full bg-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="p-4 bg-green-400 text-white rounded-xl"
              >
                Update Site Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSite;

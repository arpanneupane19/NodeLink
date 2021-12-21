import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import axios from "axios";

function UserPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState([{}]);
  const [doesUserExist, setDoesUserExist] = useState(true);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    axios
      .get(`/api/${username}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
          "real-request": true,
        },
      })
      .then((response) => {
        if (response.data.message === "User does not exist") {
          setDoesUserExist(false);
        }

        if (response.data.message === "User found") {
          setDoesUserExist(true);
          setUserData(response.data.userData);
          setImgUrl(
            `/api/get-profile-picture/${response.data.userData.username}`
          );
        }
      });
  }, [username]);

  if (doesUserExist === false) {
    return <Redirect to="/404-page-not-found" />;
  }

  if (typeof userData !== "undefined") {
    return (
      <div
        className="font-sans antialiased"
        style={{
          backgroundColor: userData.bgColor,
          color: userData.textColor,
          minHeight: "100vh",
        }}
      >
        <div className="flex flex-col justify-center items-center pt-12 mx-6">
          <div className="flex flex-col justify-center items-center mb-12">
            <img
              src={imgUrl}
              alt="Profile"
              className="rounded-full"
              width="100"
            />
            <h1 className="md:text-2xl text-xl mt-4 mb-2 tracking-widest">
              {userData.userFirstName} {userData.userLastName}
            </h1>
            <span className="tracking-wide">{userData.userBio}</span>
          </div>
          <div className="flex flex-col justify-center items-center sm:w-1/2 tracking-wide w-full">
            {typeof userData.userLinks !== "undefined" ? (
              userData.userLinks.map((link, index) => (
                <div
                  key={index}
                  className="py-4 px-6 text-lg text-center shadow-lg rounded-2xl mb-6 w-full"
                  style={{ backgroundColor: userData.linkBgColor }}
                >
                  <a
                    href={link.linkURL}
                    target="__blank"
                    style={{ color: userData.linkColor }}
                  >
                    {link.linkName}
                  </a>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          <p
            className="text-center tracking-wider"
            style={{ bottom: 24, position: "absolute" }}
          >
            Powered by NodeLink ❤️
          </p>
        </div>
      </div>
    );
  } else {
    <p>Loading...</p>;
  }
}

export default UserPage;

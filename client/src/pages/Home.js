import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import demo from "./assets/demo.png";
import { Navbar } from "../components/Navbar";

function Home() {
  const [token, setToken] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(true);
    }
  }, []);

  if (token) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="font-sans antialiased bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center md:pt-36 pt-24">
        <div className="text-center tracking-widest mb-12">
          <h1 className="md:text-4xl text-2xl mb-2">
            One Link That Does It All
          </h1>
          <span className="text-gray-600">
            Connect all your audiences with one link.
          </span>
        </div>

        <div className="flex flex-col mb-24">
          <Link
            to="/register"
            className="p-4 bg-green-500 rounded-xl tracking-wide text-white text-center font-semibold cursor-pointer hover:bg-green-600"
          >
            GET STARTED FOR FREE
          </Link>
          <span className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:no-underline">
              Log in
            </Link>
            .
          </span>
        </div>

        <div className="flex flex-col justify-center items-center mb-10 ">
          <img
            src={demo}
            alt="Demo for user profile"
            width="300"
            className="mb-10"
          />
          <div className="border border-green-400 md:p-4 p-3 sm:text-base text-sm rounded-3xl text-center">
            nodelinkapp.herokuapp.com/
            <span className="text-gray-600">yourNameHere</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

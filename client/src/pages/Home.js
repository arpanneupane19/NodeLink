import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import demo from "./assets/demo.png";
import { Navbar } from "../components/Navbar";

function Home() {
  return (
    <div className="font-sans antialiased bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center md:mt-24 mt-12">
        <div className="heading text-center tracking-widest mb-12">
          <h1 className="md:text-4xl text-3xl mb-2">
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

        <div className="flex flex-col mb-10">
          <img
            src={demo}
            alt="Demo for user profile"
            width="300"
            className="mb-10"
          />
          <div className="border border-green-400 p-4 rounded-3xl text-center">
            nodelink.com/<span className="text-gray-600">yourNameHere</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

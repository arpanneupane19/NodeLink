import React from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import CreateLink from "./pages/CreateLink";
import Analytics from "./pages/Analytics";
import Account from "./pages/Account";
import ProfilePicture from "./pages/ProfilePicture";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditSite from "./pages/EditSite";
import EditLink from "./pages/EditLink";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/404";
import Forbidden from "./pages/403";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={["/", "/home"]}>
          <Home />
        </Route>

        <Route exact path={["/register", "/sign-up"]}>
          <Register />
        </Route>

        <Route exact path={["/login", "/log-in"]}>
          <Login />
        </Route>

        <Route exact path="/logout">
          <Logout />
        </Route>

        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

        <Route exact path="/create-link">
          <CreateLink />
        </Route>

        <Route exact path="/analytics">
          <Analytics />
        </Route>

        <Route exact path="/account">
          <Account />
        </Route>

        <Route exact path="/update-profile-picture">
          <ProfilePicture />
        </Route>

        <Route exact path="/change-password">
          <ChangePassword />
        </Route>

        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>

        <Route exact path="/reset-password/:token">
          <ResetPassword />
        </Route>

        <Route exact path="/edit-site">
          <EditSite />
        </Route>

        <Route exact path="/edit-link/:linkId">
          <EditLink />
        </Route>

        <Route exact path="/404-page-not-found">
          <NotFound />
        </Route>

        <Route exact path="/403-forbidden">
          <Forbidden />
        </Route>

        <Route exact path="/:username">
          <UserProfile />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;

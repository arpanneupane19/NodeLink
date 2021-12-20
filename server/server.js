const express = require("express");
const app = express();
const session = require("express-session");
const sslRedirect = require("heroku-ssl-redirect").default;
if (process.env.MODE === "DEVELOPMENT") {
  const cors = require("cors");
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    })
  );
}
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

// Database
const db = require("./config/database.js");
db.authenticate()
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Unable to connect :(", err);
  });

const User = require("./models/User.js");
const Link = require("./models/Link.js");

// A user can have many links and you can query them by User.links(...)
User.hasMany(Link, { as: "links", onDelete: "CASCADE" });

// A link belongs to one user and that user is the linkOwner
Link.belongsTo(User, {
  as: "linkOwner",
  foreignKey: "linkOwnerId",
  constraints: false,
});

// Middlewares
app.use(
  session({
    secret: process.env.APP_SECRET_KEY,
    cookie: { maxAge: 1000 * 3600 * 24 * 7 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sslRedirect());

const { verifyJWT } = require("./middlewares/middlewares.js");

const routes = require("./routes/routes.js");
app.use(express.static(path.join(__dirname, "../client/build")));
app.post("/api/register", routes.postRegister);
app.post("/api/login", routes.postLogin);
app.get("/api/logout", routes.logout);
app.get("/api/dashboard", verifyJWT, routes.getDashboard);
app.get("/api/create-link", verifyJWT, routes.getCreateLink);
app.post("/api/create-link", verifyJWT, routes.postCreateLink);
app.get("/api/edit-link/:linkId", verifyJWT, routes.getEditLink);
app.post("/api/edit-link/:linkId", verifyJWT, routes.postEditLink);
app.post("/api/delete-link/:linkId", verifyJWT, routes.deleteLink);
app.get("/api/analytics", verifyJWT, routes.getAnalytics);
app.get("/api/account", verifyJWT, routes.getAccountSettings);
app.post("/api/account", verifyJWT, routes.postAccountSettings);
app.get("/api/update-profile-picture", verifyJWT, routes.getUpdateProfilePic);
app.post("/api/update-profile-picture", verifyJWT, routes.postUpdateProfilePic);
app.get("/api/get-profile-picture/:username", routes.returnProfilePic);
app.get("/api/change-password", verifyJWT, routes.getChangePassword);
app.post("/api/change-password", verifyJWT, routes.postChangePassword);
app.get("/api/edit-site", verifyJWT, routes.getEditSite);
app.post("/api/edit-site", verifyJWT, routes.postEditSite);
app.post("/api/forgot-password", routes.postForgotPassword);
app.get("/api/reset-password/:token", routes.getResetPassword);
app.post("/api/reset-password/:token", routes.postResetPassword);
app.get("/api/:username", routes.getUserProfile);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
const PORT = process.env.PORT || 8080;

db.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

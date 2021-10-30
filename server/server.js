const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

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
    secret: "1b15dc2f6bd549a483caaccdb5186f36",
    cookie: { maxAge: 1000 * 3600 * 24 * 7 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const { verifyJWT } = require("./middlewares/middlewares.js");

const routes = require("./routes/routes.js");

app.post("/register", routes.postRegister);
app.post("/login", routes.postLogin);
app.get("/logout", routes.logout);
app.get("/dashboard", verifyJWT, routes.getDashboard);
app.get("/create-link", verifyJWT, routes.getCreateLink);
app.post("/create-link", verifyJWT, routes.postCreateLink);
app.get("/edit-link/:linkId", verifyJWT, routes.getEditLink);
app.post("/edit-link/:linkId", verifyJWT, routes.postEditLink);
app.post("/delete-link/:linkId", verifyJWT, routes.deleteLink);
app.get("/analytics", verifyJWT, routes.getAnalytics);
app.get("/account", verifyJWT, routes.getAccountSettings);
app.post("/account", verifyJWT, routes.postAccountSettings);
app.get("/edit-site", verifyJWT, routes.getEditSite);
app.post("/edit-site", verifyJWT, routes.postEditSite);
// app.get("/change-password", verifyJWT, routes.getChangePassword);
// app.post("/change-password", verifyJWT, routes.postChangePassword);
app.get("/:username", routes.getUserProfile);

const PORT = process.env.PORT;

db.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

// Imports
const User = require("../models/User.js");
const Link = require("../models/Link.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function postRegister(req, res) {
  const firstName = req.body.user.firstName;
  const lastName = req.body.user.lastName;
  const email = req.body.user.email;
  const username = req.body.user.username;
  const password = req.body.user.password;

  const emailExists = await User.findOne({ where: { email: email } });
  const usernameExists = await User.findOne({ where: { username: username } });

  if (usernameExists || emailExists) {
    res.json({ message: "Username or email already belongs to another user" });
    console.log("Username or email already belongs to another user");
  }

  if (!emailExists && !usernameExists) {
    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      let newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: hash,
      }).catch((err) => {
        console.log("Error occurred when trying to create user ", err);
      });
      res.json({ message: "User account created" });
      console.log("User account created");
    });
  }
}

async function postLogin(req, res) {
  const username = req.body.user.username;
  const password = req.body.user.password;
  const user = await User.findOne({ where: { username: username } });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.json({ message: "Password is invalid" });
      console.log("Password is invalid");
    }
    if (passwordMatch) {
      const payload = {
        id: user.id,
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" },
        (err, token) => {
          res.json({
            message: "Verification successful",
            token: token,
            user: user,
          });
        }
      );
    }
  }

  if (!user) {
    res.json({ message: "This account does not exist" });
    console.log("This account does not exist");
  }
}

async function logout(req, res) {
  res.json({ message: "Logging out" });
}

async function getDashboard(req, res) {
  const token = req.headers["x-access-token"];
  let userId = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        return decodedValue.id;
      }
    }
  );

  const user = await User.findOne({ where: { id: userId } });
  const userLinks = await Link.findAll({ where: { linkOwnerId: user.id } });
  res.json({
    message: "Logged in",
    user: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    links: userLinks,
  });
}

async function getCreateLink(req, res) {
  res.json({ message: "Logged in" });
}

async function postCreateLink(req, res) {
  const linkName = req.body.link.linkName;
  const linkURL = req.body.link.linkURL;
  const token = req.headers["x-access-token"];
  let userId = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        return decodedValue.id;
      }
    }
  );

  const linkOwner = await User.findOne({ where: { id: userId } });
  let link = await Link.create({
    linkName: linkName,
    linkURL: linkURL,
    linkOwnerId: linkOwner.id,
  }).catch((err) => {
    console.log("Error occurred when creating link...", err);
  });

  res.json({ message: "Logged in", linkCreated: true });
}

async function getEditLink(req, res) {
  const linkId = req.params.linkId;
  const link = await Link.findOne({ where: { id: linkId } });
  const token = req.headers["x-access-token"];
  let currentUserId = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        return decodedValue.id;
      }
    }
  );

  if (link) {
    if (link.linkOwnerId !== currentUserId) {
      res.json({ message: "Logged in", forbidden: "Cannot do that" });
    }
    if (link.linkOwnerId === currentUserId) {
      res.json({ message: "Logged in", link: link });
    }
  } else {
    res.json({ message: "Logged in", notFound: "404 not found" });
  }
}

async function postEditLink(req, res) {
  const linkId = req.body.link.linkId;
  const linkName = req.body.link.linkName;
  const linkURL = req.body.link.linkURL;
  const token = req.headers["x-access-token"];
  let currentUserId = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        return decodedValue.id;
      }
    }
  );
  const link = await Link.findOne({ where: { id: linkId } });

  if (link) {
    if (link.linkOwnerId !== currentUserId) {
      res.json({ message: "Logged in", forbidden: "Cannot do that" });
    }
    if (link.linkOwnerId === currentUserId) {
      await link.update({ linkName: linkName, linkURL: linkURL });
      res.json({ message: "Logged in", linkUpdated: true });
    }
  } else {
    res.json({ message: "Logged in", notFound: "404 not found" });
  }
}

async function deleteLink(req, res) {
  const linkId = req.body.linkId;
  const token = req.headers["x-access-token"];
  let currentUserId = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        return decodedValue.id;
      }
    }
  );
  const link = await Link.findOne({ where: { id: linkId } });
  if (link) {
    if (link.linkOwnerId !== currentUserId) {
      res.json({ message: "Logged in", forbidden: "Cannot do that" });
    }

    if (link.linkOwnerId === currentUserId) {
      await link.destroy();
      res.json({ message: "Logged in", linkDeleted: true });
    }
  } else {
    res.json({ message: "Logged in", notFound: "404 not found" });
  }
}

async function getAnalytics(req, res) {
  const token = req.headers["x-access-token"];
  let currentUserId = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        return decodedValue.id;
      }
    }
  );

  const user = await User.findOne({ where: { id: currentUserId } });
  const userViews = user.views;
  res.json({ message: "Logged in", views: userViews });
}

async function getAccountSettings(req, res) {
  res.json({ message: "Logged in" });
}

async function getUserProfile(req, res) {
  const username = req.params.username;
  const user = await User.findOne({ where: { username: username } });

  if (user) {
    const links = await Link.findAll({ where: { linkOwnerId: user.id } });
    res.send({
      message: "User found",
      userData: {
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userBio: user.bio,
        userLinks: links,
        bgColor: user.bgColor,
        linkBgColor: user.linkBgColor,
        linkColor: user.linkColor,
        textColor: user.textColor,
      },
    });
  }
  if (!user) {
    res.send({ message: "User does not exist" });
  }
}

module.exports = {
  postRegister: postRegister,
  postLogin: postLogin,
  logout: logout,
  getDashboard: getDashboard,
  getCreateLink: getCreateLink,
  postCreateLink: postCreateLink,
  getEditLink: getEditLink,
  postEditLink: postEditLink,
  deleteLink: deleteLink,
  getAnalytics: getAnalytics,
  getAccountSettings: getAccountSettings,
  getUserProfile: getUserProfile,
};

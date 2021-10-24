const { Sequelize } = require("sequelize");
const db = new Sequelize({
  dialect: "sqlite",
  storage: "database.db",
  logging: false,
});

module.exports = db;

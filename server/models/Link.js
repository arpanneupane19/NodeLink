const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database.js");

const Link = db.define("Link", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  linkName: {
    type: DataTypes.STRING(50),
    required: true,
    allowNull: false,
  },
  linkURL: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
});

module.exports = Link;

const { Sequelize } = require("sequelize");

let db = undefined;

if (process.env.MODE === "PRODUCTION") {
  db = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else if (process.env.MODE === "DEVELOPMENT") {
  db = new Sequelize({
    dialect: "sqlite",
    storage: "database.db",
    logging: false,
  });
}

module.exports = db;

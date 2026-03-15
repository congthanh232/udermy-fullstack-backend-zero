require("dotenv").config();
const mysql = require("mysql2/promise");

// Create the connection to database
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT, //default:3306
//   user: process.env.DB_USER, //defaul:empty
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,

// });

// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT, //default:3306
//   user: process.env.DB_USER, //defaul:empty
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitforConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0

// });

// module.exports = connection;
const { Pool } = require("pg");
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4,
});

// giả lập format mysql2
const originalQuery = connection.query.bind(connection);

connection.query = async (text, params) => {
  const res = await originalQuery(text, params);
  return [res.rows];
};

module.exports = connection;

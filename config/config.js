//  CONFIGURATION FILE FOR A NODEJS APPLICATION
// This file contains the configuration settings for the application.
// It is used to set up environment variables, database connections, and other settings.
// It is recommended to keep sensitive information out of version control.

require('dotenv').config();
const mysql = require('mysql2');

// MySQL configuration for different databases
// First database connection
const admindb = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Second database connection
const usersdb = mysql.createConnection({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

// Export the connections for use in other parts of the application
module.exports = {
  admindb,
  usersdb,
};

// Try first database connection
admindb.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Try second database connection
usersdb.connect((err) => {
  if (err) {
    console.error('Error connecting to users database:', err);
  } else {
    console.log('Connected to users database');
  }
});

// Environment variables for MySQL
// These variables should be set in a .env file or through the environment directly
// MYSQL_HOST: Host for MySQL database
// MYSQL_USER: Username for MySQL database
// MYSQL_PASSWORD: Password for MySQL database
// MYSQL_DATABASE: Name of the MySQL database
// PG_HOST: Host for PostgreSQL database
// PG_USER: Username for PostgreSQL database
// PG_PASSWORD: Password for PostgreSQL database
// PG_DATABASE: Name of the PostgreSQL database
// PG_PORT: Port for PostgreSQL database (default is 5432)

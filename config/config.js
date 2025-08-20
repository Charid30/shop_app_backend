// config/config.js
// This file contains the configuration for database connections.
// It exports the database connection pools for admin and user databases.
require('dotenv').config();
// Use mysql2 with promises for better async/await support
const mysql = require('mysql2/promise');

// Connexion Admin DB
const admindb = mysql.createPool({
  host: process.env.ADMIN_DB_HOST,
  user: process.env.ADMIN_DB_USER,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.ADMIN_DB_DATABASE,
  connectionLimit: parseInt(process.env.MYSQL_POOL_CONNECTION_LIMIT, 10) || 10,
  waitForConnections: process.env.MYSQL_POOL_WAIT_FOR_CONNECTION === 'true',
  connectTimeout: parseInt(process.env.MYSQL_POOL_CONNECTION_TIMEOUT, 10) || 10000,
  // Additional options can be added here if needed
  // For example, you can set charset, timezone, etc.
  charset: 'utf8mb4',
  timezone: 'UTC',
  queueLimit: parseInt(process.env.MYSQL_POOL_QUEUE_LIMIT, 10) || 0,
  // This allows the pool to handle more connections and manage them efficiently
  // Adjust these settings based on your application's needs
  debug: process.env.MYSQL_DEBUG === 'true', // Enable debug mode if needed
  supportBigNumbers: true, // Support for big numbers
  bigNumberStrings: true, // Return big numbers as strings
  multipleStatements: process.env.MYSQL_MULTIPLE_STATEMENTS === 'true', // Allow multiple statements in a single query
  dateStrings: true, // Return date fields as strings
  insecureAuth: process.env.MYSQL_INSECURE_AUTH === 'true', // Allow insecure authentication if needed
  trace: process.env.MYSQL_TRACE === 'true', // Enable tracing for debugging
  typeCast: (field, next) => {
    if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
      return field.string(); // Return date fields as strings
    }
    return next();
  },
  // This allows for custom type casting of fields, especially for date and time fields
  // Adjust these settings based on your application's needs
  namedPlaceholders: true, // Use named placeholders for queries
  // This allows for named placeholders in queries, making them more readable
  rowsAsArray: process.env.MYSQL_ROWS_AS_ARRAY === 'true', // Return rows as arrays
  // This allows for returning rows as arrays instead of objects, which can be useful in some cases
  connectionLimit: parseInt(process.env.MYSQL_POOL_CONNECTION_LIMIT, 10) || 10, // Limit the number of connections in the pool
  // This sets the maximum number of connections in the pool, preventing overload
});

// Connexion Users DB
const usersdb = mysql.createPool({
  host: process.env.USERS_DB_HOST,
  user: process.env.USERS_DB_USER,
  password: process.env.USERS_DB_PASSWORD,
  database: process.env.USERS_DB_DATABASE,
  connectionLimit: parseInt(process.env.MYSQL_POOL_CONNECTION_LIMIT, 10) || 10,
  waitForConnections: process.env.MYSQL_POOL_WAIT_FOR_CONNECTION === 'true',
  connectTimeout: parseInt(process.env.MYSQL_POOL_CONNECTION_TIMEOUT, 10) || 10000,
  // Additional options can be added here if needed
  // For example, you can set charset, timezone, etc.
  charset: 'utf8mb4',
  timezone: 'UTC',
  queueLimit: parseInt(process.env.MYSQL_POOL_QUEUE_LIMIT, 10) || 0,
  // This allows the pool to handle more connections and manage them efficiently
  debug: process.env.MYSQL_DEBUG === 'true', // Enable debug mode if needed
  supportBigNumbers: true, // Support for big numbers
  bigNumberStrings: true, // Return big numbers as strings
  multipleStatements: process.env.MYSQL_MULTIPLE_STATEMENTS === 'true', // Allow multiple statements in a single query
  dateStrings: true, // Return date fields as strings
  insecureAuth: process.env.MYSQL_INSECURE_AUTH === 'true', // Allow insecure authentication if needed
  trace: process.env.MYSQL_TRACE === 'true', // Enable tracing for debugging
  typeCast: (field, next) => {
    if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
      return field.string(); // Return date fields as strings
    }
    return next();
  },
  namedPlaceholders: true, // Use named placeholders for queries
  rowsAsArray: process.env.MYSQL_ROWS_AS_ARRAY === 'true', // Return rows as arrays
  connectionLimit: parseInt(process.env.MYSQL_POOL_CONNECTION_LIMIT, 10) || 10, // Limit the number of connections in the pool
  // This sets the maximum number of connections in the pool, preventing overload
  // This allows for custom type casting of fields, especially for date and time fields
  // Adjust these settings based on your application's needs
  // This allows for named placeholders in queries, making them more readable
  // This allows for returning rows as arrays instead of objects, which can be useful in some cases
  // This allows the pool to handle more connections and manage them efficiently
  // Adjust these settings based on your application's needs
  // This sets the maximum number of connections in the pool, preventing overload
  // Adjust these settings based on your application's needs
  // This allows for custom type casting of fields, especially for date and time fields
});

// Test connexion adminDb
admindb.getConnection()
  .then(conn => {
    console.log("---------->Connected to Admin DB");
    conn.release();
  })
  .catch(err => {
    console.error("------X---->Error connecting to Admin DB:", err);
  });

// Test connexion usersDb
usersdb.getConnection()
  .then(conn => {
    console.log("---------->Connected to Users DB");
    conn.release();
  })
  .catch(err => {
    console.error("------X---->Error connecting to Users DB:", err);
  });

// This code exports the database connection pools for admin and user databases.
// This allows other modules to use these connections for database operations.
// Exporting the connection pools for admin and user databases
module.exports = {
  admindb,
  usersdb,
};
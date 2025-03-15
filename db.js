// import Sequelize from "sequelize";
// import dotenv from 'dotenv';

// dotenv.config({ path: './.env' });

// let sequelize;
// let authsequelize;

// // export const dbConnection = async () => {
// //     const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
// //         host: process.env.DB_HOST,
// //         dialect: 'mssql'
// //     });
// //     try {
// //         await sequelize.authenticate(); // Ensure the connection is established
// //         console.log('Connection has been established successfully.');
// //         return sequelize;
// //     } catch (error) {
// //         console.error('Unable to connect to the database:', error);
// //         throw error; // Re-throw the error to handle it properly
// //     }
// // };

// // export const dbConnection = async () => {
// //     if (!sequelize) {
// //         sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
// //             host: process.env.DB_HOST,
// //             dialect: 'mssql'
// //         });

// //         try {
// //             await sequelize.authenticate();
// //             console.log('Database connected successfully.');
// //         } catch (error) {
// //             console.error('Unable to connect to the database:', error);
// //         }
// //     }
// //     return sequelize;
// // };

// export const authDbConnection = async () => {
//     if(!authsequelize) {
//         authsequelize = new Sequelize(process.env.AUTH_DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//             host: process.env.DB_HOST,
//             dialect: 'mssql',
//             pool: {
//                 max: 10, // Maximum number of connections
//                 min: 0, // Minimum number of connections
//                 acquire: 120000, // 120 seconds before throwing a timeout error
//                 idle: 30000, // Connection will be closed after 30 seconds of inactivity
//             },
//             dialectOptions: {
//                 options: {
//                     requestTimeout: 120000, // 120 seconds timeout for SQL queries
//                     connectionTimeout: 120000, // 120 seconds timeout for establishing a connection
//                     encrypt: false, // Set to true if using Azure SQL
//                     enableArithAbort: true, // Helps prevent certain errors
//                 },
//             },
//         });

//         try {
//             await authsequelize.authenticate();
//             console.log('Auth Database Conencted Successfully.');
//         } catch (error) {
//             console.log('Unable to Connect to the database:', error);
//         }
//     }
//     return authsequelize;
// }

// export const authsequelizeInstance = () => {
//     if(!authsequelize) {
//         throw new Error("Sequelize instance is not initialized. Call dbConnection() first.");
//     }
//     return authsequelize;
// }

// // export const getSequelizeInstance = () => {
// //     if (!sequelize) {
// //         throw new Error("Sequelize instance is not initialized. Call dbConnection() first.");
// //     }
// //     return sequelize;
// // };

import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

let authsequelize;

export const authDbConnection = async () => {
  if (!authsequelize) {
    authsequelize = new Sequelize(
      process.env.AUTH_DB_NAME,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mssql",
        pool: {
          max: 10,
          min: 0,
          acquire: 120000,
          idle: 30000,
        },
        dialectOptions: {
          options: {
            requestTimeout: 120000,
            connectionTimeout: 120000,
            encrypt: false,
            enableArithAbort: true,
          },
        },
        // logging: console.log, // Enable query logging to debug issues
      }
    );

    try {
      await authsequelize.authenticate();
      console.log("Auth Database Connected Successfully.");
    } catch (error) {
      console.error("Unable to connect to the auth database:", error);
      throw error;
    }
  }
  return authsequelize;
};

export const authsequelizeInstance = () => {
  if (!authsequelize) {
    throw new Error(
      "Sequelize instance is not initialized. Call authDbConnection() first."
    );
  }
  return authsequelize;
};

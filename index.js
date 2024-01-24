import mysql from "mysql";
import cors from "cors";
import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test@123",
  database: "test",
});
const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node js api project",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8800/",
      },
    ],
  },

  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(cors());

/**
 * @swagger
 *  components:
 *      schemas:
 *          Book:
 *              type: object
 *              properties:
 *                  title:
 *                    type: string
 *                  desc:
 *                    type: string
 *                  cover:
 *                     type: string
 *                  price:
 *                     type: integer
 *
 */

/**
 * @swagger
 * /:
 *   get:
 *       summary: this api is used to check get method is working or not
 *       description : this api is used to check get method is working or not
 *       responses:
 *           200:
 *               description : to test get method
 */
app.get("/", (req, res) => {
  res.json("hello this is the backend");
});

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'test@123';

/**
 * @swagger
 * /books:
 *  get:
 *    summary:  to get all books from mysql
 *    description: this api is used to fetch data from mysql
 *    responses:
 *      200:
 *          description : this api is used to fetch data from mysql
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schemas/Book'
 */
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.json(data);
  });
});

/**
 * @swagger
 * /books/{id}:
 *  get:
 *    summary:  to get all books from mysql
 *    description: this api is used to fetch data from mysql
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *          description : this api is used to fetch data from mysql
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schemas/Book'
 *
 */
app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "SELECT * FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);

    if (data.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = data[0];
    return res.json(book);
  });
});

/**
 * @swagger
 * /books:
 *  post:
 *    summary:  used to insert data to mysql
 *    description: this api is used to fetch data from mysql
 *    requestBody:
 *      required: true
 *      content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *    responses:
 *      200:
 *          description : books has been created successfully
 */

app.post("/books", (req, res) => {
  const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);

    return res.json("books has been created successfully");
  });
});

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *    summary:  this api is used to delete data from mysql
 *    description: this api is used to fetch data from mysql
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *          description : this api is used to delete data from mysql
 *
 *
 */

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id=?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);

    return res.json("books has been deleted successfully");
  });
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary:  used to update data to mysql
 *    description: this api is used to update data from mysql
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *    responses:
 *      200:
 *          description : updated successfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schemas/Book'
 */

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id=?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);

    return res.json("books has been updated successfully");
  });
});
app.listen(8800, () => {
  console.log("connected to backend!");
});

// server.js

// import express from "express";
// import bodyParser from "body-parser";
// import mysql from "mysql";

// const app = express();
// const port = 8800;

// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "test@123",
//   database: "test",
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL");
// });

// app.use(bodyParser.json());

// // API endpoint to insert data
// app.post("/upload", (req, res) => {
//   const jsonDataArray = req.body;

//   // Insert data into the database
//   const sql = "INSERT INTO your_table_name SET ?";
//   jsonDataArray.forEach((jsonData) => {
//     db.query(sql, jsonData, (err) => {
//       if (err) {
//         console.error("Error inserting data:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }
//     });
//   });

//   res.status(200).json({ message: "Data inserted successfully" });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// server.js

// import express from "express";
// import bodyParser from "body-parser";
// import mysql from "mysql2/promise";
// import cors from "cors";

// const app = express();
// const port = 8800;
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());

// // MySQL database configuration
// const dbConfig = {
//   host: "localhost",
//   user: "root",
//   password: "test@123",
//   database: "test",
// };

// app.get("/books", (req, res) => {
//   const q = "SELECT * FROM books";
//   dbConfig.query(q, (err, data) => {
//     if (err) return res.json(err);

//     return res.json(data);
//   });
// });

// // Endpoint to handle Excel data upload
// app.post("/upload", async (req, res) => {
//   const excelData = req.body;

//   try {
//     // Connect to MySQL database
//     const connection = await mysql.createConnection(dbConfig);

//     // Insert Excel data into MySQL
//     for (const row of excelData) {
//       const { title, desc, price, cover } = row;
//       await connection.execute(
//         "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?, ?, ?, ?)",
//         [title, desc, cover, price]
//       );
//     }

//     // Close the database connection
//     connection.end();

//     res.status(200).json({ message: "Data successfully saved to MySQL." });
//   } catch (error) {
//     console.error("Error saving data to MySQL:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// import express from "express";
// import mysql from "mysql2/promise";
// import cors from "cors";

// const app = express();
// const port = 8800;

// app.use(cors());
// app.use(express.json({ limit: "50000000kb" }));

// // MySQL database configuration
// const dbConfig = {
//   host: "178.16.138.22",
//   port: 3306,
//   user: "remote_user",
//   password: "Admin@1234",
//   database: "server",
// };

// app.get("/", (req, res) => {
//   res.json("hello this is the backend");
// });

// // Function to check if the table exists
// const tableExists = async (connection, tableName) => {
//   const [rows] = await connection.execute(
//     "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?",
//     [dbConfig.database, tableName]
//   );

//   return rows[0].count > 0;
// };

// // Function to create the table if it doesn't exist
// const createTableIfNeeded = async (connection, tableName) => {
//   const doesTableExist = await tableExists(connection, tableName);

//   if (!doesTableExist) {
//     // Create the table with your desired schema
//     await connection.execute(
//       `CREATE TABLE ${tableName} (
//       \`id\` INT NOT NULL ,
//       \`name\` VARCHAR(45) NOT NULL,
//       \`phoneNo\` BIGINT,
//       \`address\` VARCHAR(45) NOT NULL,
//       \`pincode\` INT ,
//       PRIMARY KEY (\`id\`)
//     )`
//     );
//   }
// };

// app.post("/api/Consumer_upload", async (req, res) => {
//   const { excelData } = req.body;
//   const { table } = req.query;

//   if (!table || !Array.isArray(excelData)) {
//     return res.status(400).json({
//       error:
//         "Invalid request. Provide table name and excelData in the request.",
//     });
//   }

//   try {
//     // Connect to MySQL database
//     const connection = await mysql.createConnection(dbConfig);
//     // Create the table if it doesn't exist
//     await createTableIfNeeded(connection, table);

//     for (const row of excelData) {
//       const columns = "`id`, `name`, `phoneNo`, `address`, `pincode`";
//       const values = Object.values(row);
//       const placeholders = Array(values.length).fill("?").join(",");

//       await connection.execute(
//         `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
//         values
//       );
//     }
//     // Close the database connection
//     connection.end();

//     // res.status(200).json({ message: "Data successfully saved to MySQL." });
//     res
//       .status(200)
//       .json({ message: `Data successfully saved to table ${table}.` });
//   } catch (error) {
//     console.error("Error saving data to MySQL:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Endpoint to fetch branch names
// app.get("/branches", async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute("SELECT DISTINCT name FROM branch");
//     const branches = rows.map((item) => item.name);
//     res.status(200).json(branches);
//   } catch (error) {
//     console.error("Error fetching branches:", error);
//     res.status(500).send("Error fetching branches");
//   }
// });

// app.post("/getConsumerDetails", async (req, res) => {
//   const { branch, cid } = req.body;

//   if (!branch || !cid) {
//     return res.status(400).json({
//       error: "Branch and Consumer ID are required in the request body.",
//     });
//   }

//   const tableName = `${branch}`; // Assuming your table names follow this pattern

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute(
//       `SELECT * FROM ${tableName} WHERE id = ?`,
//       [cid]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Consumer not found." });
//     }

//     const consumerDetails = rows[0];
//     res.status(200).json(consumerDetails);
//   } catch (error) {
//     console.error("Error fetching consumer details:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Endpoint to add data to the visited table
// app.post("/addToVisited", async (req, res) => {
//   const { branch, cid, employeeId } = req.body;

//   if (!branch || !cid || !employeeId) {
//     return res.status(400).json({
//       error: "Branch, CID, and Employee ID are required in the request body.",
//     });
//   }

//   const visitedTableName = "visited"; // Assuming your visited table names follow this pattern

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     // Insert data into the visited table with the current date and time
//     await connection.execute(
//       `INSERT INTO server.${visitedTableName} (branch, cid, employeeId, visitDateTime) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
//       [branch, cid, employeeId]
//     );

//     res.status(200).json({ message: "Data added to visited table." });
//   } catch (error) {
//     console.error("Error adding data to visited table:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/api/Branch_upload", async (req, res) => {
//   const { excelData } = req.body;
//   const { table } = req.query;

//   if (!table || !Array.isArray(excelData)) {
//     return res.status(400).json({
//       error:
//         "Invalid request. Provide table name and excelData in the request.",
//     });
//   }

//   try {
//     // Connect to MySQL database
//     const connection = await mysql.createConnection(dbConfig);
//     // Create the table if it doesn't exist
//     await createTableIfNeeded(connection, table);

//     for (const row of excelData) {
//       const columns = "`name`";
//       const values = Object.values(row);
//       const placeholders = Array(values.length).fill("?").join(",");

//       await connection.execute(
//         `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
//         values
//       );
//     }
//     // Close the database connection
//     connection.end();

//     // res.status(200).json({ message: "Data successfully saved to MySQL." });
//     res
//       .status(200)
//       .json({ message: `Data successfully saved to table ${table}.` });
//   } catch (error) {
//     console.error("Error saving data to MySQL:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

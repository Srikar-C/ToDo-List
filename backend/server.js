import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

//Routes
const app = express();
const port = 5000;

//names
const dbName = "todolist";
const UserTable = "users";
const ListTable = "lists";

const db = new pg.Client({
  port: 5432,
  host: "localhost",
  password: "tiger",
  database: dbName,
  user: "postgres",
});

db.connect();

//Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Paths Initial

app.get("/", (req, res) => {
  const dbQuery = `create database ${dbName};`;
  db.query(dbQuery, (err, response) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Database created successfully");
    }
  });

  const userQuery = `create table ${UserTable}(id serial primary key,users varchar(20),email varchar(40),password varchar(20));`;
  db.query(userQuery, (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(`${UserTable} table created`);
    }
  });

  const listQuery = `create table ${ListTable}(id serial primary key,uid integer references ${UserTable}(id),text varchar(200));`;
  db.query(listQuery, (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(`${ListTable} table created`);
    }
  });
});

app.post("/adduser", (req, res) => {
  const { name, email, password } = req.body;
  console.log(`${name} ${email} ${password}`);

  // First, check if the email already exists in the database
  const checkEmailQuery = `SELECT * FROM ${UserTable} WHERE email = $1;`;

  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({
        error: "Error on User's Email is exist or not /adduser query error",
      });
    }

    if (result.rows.length > 0) {
      // Email already exists
      return res.status(400).json({ error: "Email already exists" });
    } else {
      // Email does not exist, proceed to insert the new user
      const insertQuery = `INSERT INTO ${UserTable} (users, email, password) VALUES ($1, $2, $3) RETURNING *;`;
      const values = [name, email, password];

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: "Failed to add user" });
        } else {
          console.log("User added successfully");
          return res.status(201).json(result.rows[0]);
        }
      });
    }
  });
});

app.post("/getuser", (req, res) => {
  const { email, password } = req.body;
  console.log(`Users: ${email} ${password}`);
  const query = `SELECT * FROM ${UserTable} WHERE email = $1 and password=$2;`;
  const values = [email, password];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch user /getuser query error" });
    } else {
      if (result.rows.length === 0) {
        // User not found
        return res.status(404).json({ error: "User doesnot found" });
      } else {
        // User found, return user ID and username
        // if (result.rows.length === 1) {
        const user = result.rows[0];
        return res.status(200).json({ userId: user.id, userName: user.users });
        // } else {
        //   const user = result.rows;
        //   for (let i = 0; i < user.length; i++) {
        //     if (user[i].password === password) {
        //       return res
        //         .status(200)
        //         .json({ userId: user[i].id, userName: user[i].users });
        //     }
        //   }
        //   return res.status(404).json({ error: "Password incorrect" });
        // }
      }
    }
  });
});

app.post("/getList", (req, res) => {
  const { id } = req.body;
  console.log(`id: ${id}`);
  const listQuery = `SELECT * FROM ${ListTable} WHERE uid = $1;`;
  db.query(listQuery, [id], (err, result) => {
    if (err) {
      console.log(err.message);
      return res
        .status(500)
        .json({ error: "Failed to retrieve list items /getlist query error" });
    } else {
      console.log("Successfully retrieved list items");
      return res.status(200).json(result.rows);
    }
  });
});

app.post("/addList", (req, res) => {
  const { id, item } = req.body;
  console.log(`id: ${id}, item: ${item}`);
  const itemQuery = `INSERT INTO ${ListTable} (uid, text) VALUES ($1, $2) RETURNING *;`;
  db.query(itemQuery, [id, item], (err, result) => {
    if (err) {
      console.log("Error on adding from backend:", err.message);
      return res
        .status(500)
        .json({ error: "Failed to add list item /addlist query error" });
    } else {
      console.log("Successfully added", result.rows[0]);
      return res.status(201).json(result.rows[0]);
    }
  });
});

app.post("/forgot", (req, res) => {
  const { email, password } = req.body;
  const updQuery = `UPDATE ${UserTable} SET password = $2 WHERE email = $1 RETURNING *;`;

  db.query(updQuery, [email, password], (err, result) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Failed to update password /forgot query error" });
    } else {
      console.log("Password updated successfully");
      return res.status(200).json(result.rows[0]);
    }
  });
});

app.get("/users", (req, res) => {
  db.query(`SELECT * FROM ${UserTable};`, (err, result) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch users /users query error" });
    } else {
      // Send the list of users in the response
      return res.status(200).json(result.rows);
    }
  });
});

// listening to port
app.listen(port, (req, res) => {
  console.log(`Port is listening in http://localhost:${port}`);
});

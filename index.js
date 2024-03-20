const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
// const redis = require("redis");
const axios = require("axios");


dotenv.config({
  path: "./.env",
});
const db = require("./db/index.js");

// CORS: cross origin resource sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    crendentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/getsubmissions", (req, res) => {
  const sql = "SELECT * from submissionstable";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching data: ", err);
      res.status(500).send("Internal Server Error");
    }
    console.log("Data fetched successfully", data);
    res.send(data);
    return;
  });
});

// ************************************** X ***********************************************
// Tried so many times, but was not able to complete this. Definitely after putting efforts on docker and redish i will do this task easily.
// Create Redis client
// (async () => {
//   const client = redis.createClient(5379);
//   // Connect to Redis
//   client.on("connect", () => {
//     console.log("Connected to Redis");
//   });

//   // Handle errors
//   client.on("error", (err) => {
//     console.error("Redis error:", err);
//   });

//   await client.connect() ;
// })();

// var cacheKey = 0;

// function cache(req, res, next) {
//   client.get(cacheKey, (err, cachedData) => {
//     if (err) {
//       console.error("Error retrieving data from cache:", err);
//     } else {
//       if (cachedData) {
//         // Parse the JSON data back into an array of objects
//         const dataArray = JSON.parse(cachedData);
//         console.log("Data retrieved from cache");
//         res.send(dataArray);
//       } else {
//         console.log("No data found in cache");
//         next();
//       }
//     }
//   });
// }

// function getSubmissions(req, res, next) {
//   try {
//     console.log("Fetching Data...");
//     db.query("SELECT * FROM submissions", async (error, results) => {
//       if (error) throw error;

//       // Store fetched data in Redis for future use
//       cacheKey = results.length;
//       console.log(cacheKey);
//       client.set(cacheKey, 3600, JSON.stringify(results)); // Cache for 1 hour (3600 seconds)

//       // Return fetched data
//       res.json(results);
//     });
//   } catch (error) {
//     console.err(error);
//   }
// }

// Endpoint to fetch submissions
// app.get("/getsubmissions", cache, getSubmissions);

// ************************************* X *********************************************

app.post("/onsubmit", async (req, res) => {
  const formData = req.body;
  const { username, language, stdin, sourceCode } = formData;
  let data = {
    source_code: sourceCode,
    language_id: language,
    stdin: stdin,
    expected_output: "", // Assuming you don't have expected output in the form
  };


  const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  const sql =
    "INSERT INTO submissionstable (username, lang, standard_input, source_code, submission_time, output ) VALUES (?, ?, ?, ?, ?, ?) ";

  db.query(
    sql,
    [username, language, stdin, sourceCode, currentTime, output],
    (err, data) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Data inserted successfully", data);
      res.send("Form submitted successfully");
    }
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`backend is running on localhost:${PORT}`);
});

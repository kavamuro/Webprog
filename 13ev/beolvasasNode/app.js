import fs from "fs";
import mysql from "mysql";
import express from "express";

const PORT = 3000;

const app = express();

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server runs on: ${PORT}, http://localhost:3000`);
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

connection.connect((err) => {
  if (err) {
    console.log("A kapcsolat nem jott letre");
    throw err;
  }
});

const createDb = async () => {
  await connection.query(
    "CREATE DATABASE IF NOT EXISTS tunnels CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    (err, qres) => {
      if (err) {
        console.log(err);
      }
    },
  );
};

const createTable = async () => {
  connection.query("USE tunnels");
  await connection.query(
    "CREATE TABLE IF NOT EXISTS cntunnels (id INT AUTO_INCREMENT PRIMARY KEY, nev TEXT, hossz INT, ev TEXT, tartomany TEXT)",
    (err) => {
      if (err) {
        console.log(err);
        throw err;
      }
    },
  );
};

const importData = async () => {
  fs.readFile("CNtunnels.csv", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    data = data.split("\r\n");
    let t = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i].length > 0) {
        t.push(data[i].split(";"));
      }
    }

    connection.query(
      "INSERT INTO cntunnels (nev, hossz, ev, tartomany) VALUES ?",
      [t],
      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
  });
};

app.get("/import", async (req, res) => {
  try {
    await createDb();
    await createTable();
    await importData();

    return res.status(200).send("Sikeres importalas");
  } catch (err) {
    console.log(err);
    return res.status(400).send("hiba");
  }
});

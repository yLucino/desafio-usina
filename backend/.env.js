import mysql from "mysql";
import jwt from "jsonwebtoken";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Chuva2243#",
  database: "crud"
});

export const SECRET_KEY = "8&ai0980allss81*%";

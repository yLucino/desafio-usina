import { db } from "../../.env.js";
import { SECRET_KEY } from "../../.env.js";
import jwt from 'jsonwebtoken';

export const postSearchLoginAndRegister = (req, res) => {
  const { username, password } = req.body;
  
  const q = "SELECT * FROM crud.login WHERE username = ? AND password = ?";

  db.query(q, [username, password], (error, data) => {
    if (error) {
      console.log('Error when trying to login', error);
      return res.status(500).json({ error: 'Error in try login in crud.login.' })
    }
    if (data.length > 0) {
      const token = jwt.sign(
        {
          id: data[0].id,
          username: data[0].username
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ token, message: 'Login Successfully.' });
    } else {
      return res.json({ message: 'No record user or password.' });
    }
  });
}

export const postRegisterNewUser = (req, res) => {
  const { username, password, name, city, state, country, phone } = req.body;

  const queryCreate = "INSERT INTO crud.login (username, password, name, city, state, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(queryCreate, [username, password, name, city, state, country, phone], (error) => {
    if (error) {
      console.log('Error in adding new User:', error);
      return res.status(500).json({ error: 'Error adding newUser.' })
    }

    res.status(200).json({ message: 'New User added successfully.' });
  });
}
import { db } from "../../.env.js";

export const getUsers = (req, res) => {
  const username = req.params.username;

  const q = "SELECT * FROM crud.login WHERE username = ?";

  db.query(q, [username], (error, data) => {
    if (error) {
      console.log('Error when get users', error);
      return res.status(500).json({ error: 'Error geting users.' })
    }

    res.status(200).json(data);
  });
}
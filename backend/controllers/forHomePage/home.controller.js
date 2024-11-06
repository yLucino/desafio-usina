import { db } from "../../.env.js";

export const getMovies = (_, res) => {
  const q = "SELECT * FROM crud.movies";
  
  db.query(q, (error, data) => {
    if (error) {
      console.log('Error when get movies from crud.movise', error);
      return res.status(500).json({ error: "Error geting movies." })
    }

    return res.status(200).json(data);
  });
}

export const getMovieInfoById = (req, res) => {
  const movieId = req.params.id;

  const q = "SELECT * FROM crud.movies WHERE id = ?";

  db.query(q, [movieId], (error, data) => {
    if (error) {
      console.log('Error when get movie info by id', error);
      return res.status(500).json({ error: 'Error geting movie by id' })
    }

    res.status(200).json(data);
  })
} 

export const putMovie = (req, res) => {
  const movieId = req.params.id;
  const { title, description, gender, year_release, duration, evaluation_note, imageUrl } = req.body;

  const q = "UPDATE crud.movies SET title = ?, description = ?, gender = ?, year_release = ?, duration = ?, evaluation_note = ?, imageUrl = ? WHERE id = ?";

  db.query(q, [title, description, gender, year_release, duration, evaluation_note, imageUrl, movieId], (error) => {
    if (error) {
      console.log('Error when updating movie', error);
      return res.status(500).json({ error: 'Error updating movie in crud.movie' });
    }

    res.status(200).json({ message: 'Movie updated successfully.' });
  });
}

export const putAssessmentInMovie = (req, res) => {
  const movieId = req.params.id;
  const { evaluation_note, comments } = req.body;

  const q = "UPDATE crud.movies SET evaluation_note = ?, comments = ? WHERE id = ?"

  db.query(q, [evaluation_note, comments, movieId], (error) => {
    if (error) {
      console.log('Error in put Assessment in movieId', error);
      return res.status(500).json({ error: 'Error updating assessment.' })
    }
    
    res.status(200).json({ message: 'Assessment updated successfully.' });
  });
}

export const putAssessmentInUser = (req, res) => {
  const { review, username } = req.body;

  const q = "UPDATE crud.login SET reviews = ? WHERE username = ?"

  db.query(q, [review, username], (error) => {
    if (error) {
      console.log('Error in put reviews in crud.login', error);
      return res.status(500).json({ error: 'Error updating reviews.' })
    }
    
    res.status(200).json({ message: 'Reviews updated successfully.' });
  });
}

export const postNewMovie = (req, res) => {
  const { title, description, gender, year_release, duration, evaluation_note, imageUrl } = req.body;

  const q = "INSERT INTO crud.movies (title, description, gender, year_release, duration, evaluation_note, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(q, [title, description, gender, year_release, duration, evaluation_note, imageUrl], (error) => {
    if (error) {
      console.log('Error when adding new movie', error);
      return res.status(500).json({ error: 'Error adding new movies in crud.movies' });
    }

    res.status(200).json({ message: 'New movie added successfully.' })
  });
}

export const deleteMovie = (req, res) => {
  const movieId = req.params.id;

  const q = "DELETE FROM crud.movies WHERE id = ?";

  db.query(q, [movieId], (error) => {
    if (error) {
      console.log('Error when deleting movie from crud.movies', error);
      return res.status(500).json({ error: 'Error deleting movie.' });
    }

    res.status(200).json({ message: 'Movie deleted successfully.' });
  })
}
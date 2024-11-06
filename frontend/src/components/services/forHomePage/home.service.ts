import axios from "axios";
import { MoviesModel } from "../../../app/shared/models/movies";

export const getMovies = async () => {
  try {
    const response = await axios.get('/api/home/movies');

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.log('Error in get movies from backend', error);
  }
}

export const getMovieById = async (id: number | undefined) => {
  try {
    const response = await axios.get(`/api/home/movie-info/${id}`);
    if (response.status === 200) {
      return response.data[0]
    }
  } catch (error) {
    console.log('Error in get movie by id', error);
  }
}

export const putMovie = async (title: string, description: string, gender: string, year_release: string, duration: string, evaluation_note: string | undefined, imageUrl: string, id: number | undefined) => {
  try {
    const response = await axios.put(`/api/home/update-movies/${id}`, { title, description, gender, year_release, duration, evaluation_note, imageUrl });

    if (response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    console.log('Error in put movie', error);
  }
}

export const putAssessmentInMovie = async (evaluation_note: string | undefined, comments: string | undefined, username: string | undefined, id: number | undefined) => {
  try {
    const response = await axios.put(`/api/home/update-movie/assessment/${username}/${id}`, { evaluation_note, comments });

    if (response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    console.log('Error in put assessment in movie', error);
  }
}

export const putAssessmentInUser = async (review: string | undefined, username: string | undefined) => {
  try {
    const response = await axios.put(`/api/home/update-movie/assessment/${username}`, {review, username});

    if (response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    console.log('Error in put assessment in user', error);
  }
}

export const postMovie = async (movie: MoviesModel) => {
  try {
    const response = await axios.post('/api/home/add-movies', movie)

    if (response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    console.log('Error in post movie', error);
  }
}

export const deleteMovie = async (id: number | undefined) => {
  try {
    const response = await axios.delete(`/api/home/delete-movies/${id}`);

    if (response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    console.log('Error in delete movie', error);
  }
}
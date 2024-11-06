import express from "express";
import { deleteMovie, getMovieInfoById, getMovies, postNewMovie, putAssessmentInMovie, putAssessmentInUser, putMovie } from "../../controllers/forHomePage/home.controller.js";

const router = express.Router();

router.get("/movies", getMovies);
router.get("/movie-info/:id", getMovieInfoById);
router.put("/update-movies/:id", putMovie);
router.put("/update-movie/assessment/:username/:id", putAssessmentInMovie);
router.put("/update-movie/assessment/:username", putAssessmentInUser);
router.post("/add-movies", postNewMovie);
router.delete("/delete-movies/:id", deleteMovie);

export default router;
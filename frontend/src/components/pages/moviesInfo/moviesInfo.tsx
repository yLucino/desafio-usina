import { useEffect, useState } from "react"
import { MoviesModel } from "../../../app/shared/models/movies"
import { Link, useParams } from "react-router-dom";
import { getMovieById, putAssessmentInMovie, putAssessmentInUser } from "../../services/forHomePage/home.service";
import Header from "../../partials/header/header";
import { Button, Rating, Stack, TextField } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from "react-toastify";
import { getUsers } from "../../services/forRecommendedPage/recommended.service";
import { UserModel } from "../../../app/shared/models/user";


const MovieInfo = () => {
  const [ movies, setMovies ] = useState<MoviesModel>();
  const { id, username } = useParams();
  const movieId = id ? parseInt(id, 10) : undefined;

  const [ currentUser, setCurrentUser ] = useState<UserModel[]>([]);

  const [ isModalRateOpen, setIsModalRateOpen ] = useState(false);
  const [ ratingValue, setRatingValue ] = useState<number | null>(null);
  const [ valeuCommentInput, setValeuCommentInput ] = useState('');
  const [ comments, setComments ] = useState<string[]>([]);

  // Get notes
  const [ allAverage, setAllAverage ] = useState<number[]>([]);
  const [ arrayNotes, setArrayNotes ] = useState<MoviesModel>();


  const [ reRender, setReRender ] = useState(Boolean)
  
  useEffect(() => {
    const getMovie = async (id: number | undefined) => {
      if (movieId !== undefined) {
        try {
          const response = await getMovieById(id);
          setMovies(response);
          setArrayNotes(response)
          getArrayComments(response);
          getArrayEvaluationNote(response);
        } catch (error) {
          console.log('Error in get movie', error);
        }
      }
    }

    const getUser = async (username: string | undefined) => {
      try {
        const response = await getUsers(username);
        setCurrentUser(response);
      } catch (error) {
        console.log('Error in get all users', error);
      }
    }
    
    getUser(username);
    getMovie(movieId);
    setReRender(false);
  }, [movieId, reRender, username]);



  const getArrayComments = (movie: MoviesModel) => {
    if (movie.comments) {
      const newComments = movie.comments.split("| ");
  
      setComments(prevComments => [
        ...new Set([...prevComments, ...newComments])
      ]);
    }
  }

  const getArrayEvaluationNote = (movies: MoviesModel | undefined) => {
    const allNotes: string[][] = []; 
    
      if (movies?.evaluation_note) { 
        const newNotes = movies.evaluation_note.split(", "); 
        allNotes.push(newNotes);
      } else {
        allNotes.push([]);
      }

    return allNotes
  };

  const putAddAssessmentInMovie = async (evaluation_note: string | undefined, comments: string | undefined, username: string | undefined, id: number | undefined) => {
    try {
      const response = await putAssessmentInMovie(evaluation_note, comments, username, id)

      if (response === 'Assessment updated successfully.') {
        return true
      }
    } catch (error) {
      console.log('Error in adding/updating assessment in movie', error);
      return false
    }
  }

  const putAddAssessmentInUser = async (review: string | undefined, username: string | undefined) => {
    try {
      const response = await putAssessmentInUser(review, username);

      if (response === 'Reviews updated successfully.') {
        return true
      }
    } catch (error) {
      console.log('Error in add/update assessment in user', error);
      return false
    }
  }


  const averageNotes = (ratings: string[][]) => {
    const averages: number[] = [];

    ratings.forEach((noteArray) => {
        if (noteArray.length === 0) {
          averages.push(0);
        } else {
          const total = noteArray.reduce((sum, note) => sum + parseFloat(note), 0);
          const average = total / noteArray.length;
          averages.push(average);
        }
      });
      
      return averages
  }

  useEffect(() => {
    const newNotes = getArrayEvaluationNote(movies);
    const averages  = averageNotes(newNotes);
    setAllAverage(averages);
  }, [movies]);

  const rating = (average: number) => {    
    if (average > 0) {
      return (
        <Stack spacing={1}>
          <Rating name={`rating-${movieId}`} defaultValue={average} precision={0.5} readOnly />
        </Stack>
      )
    }
  }

  const handleRateClick = () => {
    setIsModalRateOpen(true)
  }

  const handleRatingChange = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
    event.preventDefault();
    setRatingValue(newValue);
  };

  const hanldeCloseModal = () => {
    setIsModalRateOpen(false);
    setValeuCommentInput('');
    setRatingValue(null);
  }

  const handleRateConfirm = async (rateNote: number | null, comment: string, username: string | undefined, id: number | undefined, gender: string) => {
    const allrate: string[][] | undefined = [[]];
    const allcommits: string[][] | undefined = [[]]; 

    const evaluationNotesArray = arrayNotes?.evaluation_note
    ? arrayNotes.evaluation_note.replace(/\|/g, ', ').split(", ")
    : [];
    
    const formattedComment = username ? `${username}: ${comment}` : comment;

    const commentExists = comments.some(existingComment => existingComment === formattedComment);


    if (commentExists) {
      toast.error('Comentário já adicionado');
      return;
    }

    const updatedComments = comments.map(comm => {
        if (comm.startsWith(`${username}: `)) {
            return comm; 
        }
        return comm; 
    });

    if (!updatedComments.includes(formattedComment)) {
        updatedComments.push(formattedComment);
    }

    allcommits[0].push(...updatedComments);
    allrate[0].push(...evaluationNotesArray);
    allrate[0].push(rateNote !== null ? String(rateNote) : "0");

    const notes = allrate[0].join(', ');
    const commits = allcommits[0].join('| ');

    const review = `${currentUser[0]?.reviews} | ${rateNote}, ${gender} `
   
    const addAssessmentInMovieStatus = await putAddAssessmentInMovie(notes, commits, username, id);
    
    const addAssessmentInUserStatus = await putAddAssessmentInUser(review, username)

    if (addAssessmentInMovieStatus && addAssessmentInUserStatus) {
      toast.success('Avaliação adicionada com sucesso!');
    } else {
      toast.error('Erro ao tentar adicionar a avaliação!');
    }

    setIsModalRateOpen(false);
    setReRender(true);
  }

  return(
    <>
      <div className="flex justify-center items-center lg:h-screen h-full bg-slate-800 lg:pt-20">
        <Header />
        <div className="absolute top-28 left-8">
          <Link to={`/home/${username}`} onClick={() => hanldeCloseModal()}>
            <Button variant="contained" size="large">
              <ArrowBackIcon className="mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="lg:flex pt-52 lg:pt-0 gap-10">
          <div className="flex justify-evenly bg-slate-200 p-10 gap-20 relative">
            <div className=" hidden xl:block">
              <img className="w-96 h-650 object-cover" src={movies?.imageUrl} alt="cartaz do filme" />
            </div>
            <div>
              <h1 className="text-tomato text-4xl">{movies?.title}</h1>
              <hr className="border-tomato mb-10"/>
              <p className="w-96 mb-4"><span className="font-semibold text-tomato">Descrição: </span>{movies?.description}</p>
              <p><span className="font-semibold text-tomato">Gênero: </span>{movies?.gender}</p>
              <p><span className="font-semibold text-tomato">Lançamento: </span>{movies?.year_release}</p>
              <p><span className="font-semibold text-tomato">Duração: </span>{movies?.duration}</p>
              <div className="mt-5">
                {movies && rating(allAverage[0])}
              </div>
              <div className="absolute bottom-10 right-10">
                <Button variant="contained" color="warning" onClick={() => handleRateClick()}>
                  Avaliar Filme
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly bg-slate-200 mt-10 mb-10 lg:mb-0 lg:mt-0 p-10 gap-20 relative">
            <div className="mb-10">
              <h1 className="text-tomato text-4xl">Comentários do filme</h1>
              <hr className="border-tomato mb-10"/>
                {/* .map dos comentarios */}
                <div className="overflow-x-hidden overflow-y-scroll h-3/4">
                  {comments?.map((comment, index) => (
                    <p key={index} className="w-96 mb-4"><span className="font-semibold text-tomato">Comentário de </span>{comment}</p>
                  ))}
                </div>
            </div>
          </div>
        </div>
        {isModalRateOpen && movies && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Adicionar novo filme</h2>

              <TextField multiline rows={5} sx={{marginBottom: '10px'}} variant='filled' label='Comentário' size='small' fullWidth type='text' value={valeuCommentInput} onChange={(e) => setValeuCommentInput(e.target.value)} required autoComplete="off"/>

              <p className="text-sm text-gray-500">Dar nota para o filme:</p>
              <Stack className="mb-4" spacing={1}>
                <Rating name={`rating-${movieId}`} precision={0.5} value={ratingValue} onChange={handleRatingChange}/>
              </Stack>

              <div className="flex justify-end gap-1">
                <Button variant="contained" fullWidth color="error" onClick={() => hanldeCloseModal()}>
                    Cancelar
                </Button>
                <Button type="submit" variant="contained" fullWidth color="info" onClick={
                  () => handleRateConfirm(
                    ratingValue,
                    valeuCommentInput,
                    username,
                    movies.id,
                    movies.gender
                  )}>
                    Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MovieInfo
import { Link, useParams } from "react-router-dom"
import Header from "../../partials/header/header"
import { useEffect, useState } from "react";
import { UserModel } from "../../../app/shared/models/user";
import { getUsers } from "../../services/forRecommendedPage/recommended.service";
import { getMovies } from "../../services/forHomePage/home.service";
import { MoviesModel } from "../../../app/shared/models/movies";

const RecommendedPage = () => {
  const { username } = useParams();
  const [ currentUser, setCurrentUser ] = useState<UserModel[]>([]);
  const [ movies, setMovies ] = useState<MoviesModel[]>([]);
  const [ recommendedGenre, setRecommendedGenre ] = useState<string[] | undefined>()
  const [ recommendedMovies, setRecommendedMovies ] = useState<MoviesModel[]>([])

  useEffect(() => {
    const getUser = async (username: string | undefined) => {
      try {
        const response = await getUsers(username);
        setCurrentUser(response);
      } catch (error) {
        console.log('Error in get all users', error);
      }
    }

    const getAllMovie = async () => {
      try {
        const response = await getMovies();
        setMovies(response)
      } catch (error) {
        console.log('Erro in get all movies', error);
      }
    }

    getUser(username);
    getAllMovie()
  }, [username])

  useEffect(() => {
    const takeRecommendedGenres = () => {
      if (currentUser[0]) {
        const reviews = currentUser[0].reviews?.split(' | ');
        const recommendedGenres = reviews
          ?.map((review) => {
            const [note, genre] = review.split(', ');
            return { note: parseFloat(note), genre };
          })
          .filter((review) => review.note >= 3)
          .map((review) => review.genre);

        setRecommendedGenre(recommendedGenres);
      }
    };

    if (currentUser && username) {
      takeRecommendedGenres();
    }
  }, [currentUser, username]);

  useEffect(() => {
    const takeRecommendedMovies = () => {
      const filteredMovies = movies.filter(movie =>
        recommendedGenre?.map(genre => genre.trim()).includes(movie.gender.trim())
      );

      setRecommendedMovies(filteredMovies);
    }
    
    takeRecommendedMovies();
  }, [movies, recommendedGenre])

  return(
    <>
      <Header />
      <div className="flex flex-col items-center h-screen bg-slate-800 pt-20">
        <h1 className="font-bold text-tomato text-2xl mt-10 mb-2">Filmes recomendados para {username}</h1>
        <p className="bg-slate-600 rounded-full pl-2 pr-2 text-sm text-slate-200 mb-7">Parâmetro de recomendação: Avaliação de nota nos gêneros de filmes.</p>

        <div className="bg-slate-200 m-5 md:w-1/2 p-5 rounded-lg overflow-x-hidden overflow-y-scroll max-h-screen mb-20">
          {recommendedMovies?.map((movie, index) => (
            <Link to={`/movie/${username}/${movie.id}`}>
              <div className="flex gap-5 bg-slate-300 rounded-lg p-3 mb-2 hover:bg-slate-400 transition-all" key={index}>
                <div>
                  <img className="h-40 w-48 object-cover rounded-lg" src={movie.imageUrl} alt="foto cartaz" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-tomato">{movie.title}</p>
                  <hr className="border-black mb-3"/>
                  <div className="flex flex-col h-1/2 justify-center">
                    <p><span className="font-medium">Gênero: </span>{movie.gender}</p>
                    <p><span className="font-medium">Duração: </span>{movie.duration}</p>
                    <p><span className="font-medium">Ano de lançamento: </span>{movie.year_release}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </>
  )
}

export default RecommendedPage
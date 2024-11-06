import { useEffect, useState } from "react";
import { MoviesModel } from "../../app/shared/models/movies";
import { deleteMovie, getMovies, putMovie } from "../services/forHomePage/home.service";
import { postMovie } from "../services/forHomePage/home.service";
import { toast } from "react-toastify";

import Rating from "@mui/material/Rating";
import { IconButton, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import { Link, useParams } from "react-router-dom";


const Movies = () => {
  const [ valeuTitleInput, setValeuTitleInput ] = useState('');
  const [ valeuDescriptionInput, setValeuDescriptionInput ] = useState('');
  const [ valeuGenderInput, setValeuGenderInput ] = useState('');
  const [ valeuYearReleaseInput, setValeuYearReleaseInput ] = useState('');
  const [ valeuDurationInput, setValeuDurationInput ] = useState('');
  const [ valeuImageURLInput, setValeuImageURLInput ] = useState('');
  const [ valeuEvaluationNoteInput, setValeuEvaluationNoteInput ] = useState<string | undefined>('');
  
  const [ movies, setMovies ] = useState<MoviesModel[]>([]);
  const [ seletectedMovie, setSeletectedMovie ] = useState<MoviesModel | null>(null);
  const [ isModalAddOpen, setIsModalAddOpen ] = useState(false);
  const [ isModalDeleteOpen, setIsModalDeleteOpen ] = useState(false);
  const [ isModalEditOpen, setIsModalEditOpen ] = useState(false);
  const [ isModalRequestDeleteOpen, setIsModalRequestDeleteOpen ] = useState(false);
  const [ isModalRequestEditOpen, setIsModalRequestEditOpen ] = useState(false);
  const [ reRender, setReRender] = useState(Boolean);

  // Search Input
  const [ searchValue, setSearchValue ] = useState('');
  const [ filteredMovies, setFilteredMovies ] = useState<MoviesModel[]>([]);
  
  // Get notes
  const [ allAverage, setAllAverage ] = useState<number[]>([]);
  const [ allNotes, setAllNotes ] = useState<string[][]>([]);

  const { username } = useParams();

  useEffect(() => {
    const getAllMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(response);
        setFilteredMovies(response)
        getArrayEvaluationNote(response)
      } catch (error) {
        console.log('Error in get all movies', error);
      }
    }

    getAllMovies();
    setReRender(false);
  }, [reRender]);

  const putMovieId = async (title: string, description: string, gender: string, year_release: string, duration: string, evaluation_note: string | undefined, imageUrl: string, id: number | undefined) => {
    try {
      const response = await putMovie(title, description, gender, year_release, duration, evaluation_note, imageUrl, id);

      if (response === 'Movie updated successfully.') {
        return true
      }
    } catch (error) {
      console.log('Error in editing movieId', error);
      return false
    }
  }

  const postNewMovie = async (movie: MoviesModel) => {
    try {
      const response = await postMovie(movie)

      if (response === 'New movie added successfully.') {
        return true
      }
    } catch (error) {
      console.log('Error in add new movie', error);
      return false
    }
  }

  const deleteMovieId = async (id: number | undefined) => {
    try {
      const response = await deleteMovie(id);

      if (response === 'Movie deleted successfully.') {
        return true
      }
    } catch (error) {
      console.log('Error in deleting movieId', error);
    }
  }

  const getArrayEvaluationNote = (movies: MoviesModel[]) => {
    const allNotes: string[][] = []; 

    movies.forEach((movie) => {
      if (movie.evaluation_note) { 
        const newNotes = movie.evaluation_note.split(", "); 
        allNotes.push(newNotes);
      } else {
        allNotes.push([]);
      }
    });

    setAllNotes(allNotes);
    return allNotes
  };

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

  // Handle Click
  const handleAddClick = () => {
    setIsModalAddOpen(true);
  }

  const handleDeleteClick = () => {
    setIsModalDeleteOpen(true);
  }

  const handleEditClick = () => {
    setIsModalEditOpen(true)
  }

  const hanldeCloseModal = () => {
    setIsModalAddOpen(false);
    setIsModalDeleteOpen(false);
    setIsModalRequestDeleteOpen(false);
    setIsModalRequestEditOpen(false);
    setIsModalEditOpen(false);
    setSeletectedMovie(null);
    setValeuTitleInput('');
    setValeuDescriptionInput('');
    setValeuGenderInput('');
    setValeuYearReleaseInput('');
    setValeuDurationInput('');
    setValeuEvaluationNoteInput('');
    setValeuImageURLInput('');
  }

  // Handle Request
  const deleteRequest = (movie: MoviesModel) => {
    setIsModalRequestDeleteOpen(true);
    setSeletectedMovie(movie)
  }

  const editRequest = (movie: MoviesModel) => {
    setIsModalRequestEditOpen(true);
    setSeletectedMovie(movie);
    setValeuTitleInput(movie.title);
    setValeuDescriptionInput(movie.description);
    setValeuGenderInput(movie.gender);
    setValeuYearReleaseInput(movie.year_release);
    setValeuDurationInput(movie.duration);
    setValeuEvaluationNoteInput(movie.evaluation_note);
    setValeuImageURLInput(movie.imageUrl);
  }

  // Handle Confirm
  const handleAddConfirm = async (title: string, description: string, gender: string, year_release: string, duration: string, evaluation_note: string | undefined, imageUrl: string) => {
    const movie: MoviesModel = {
      title: title,
      description: description,
      gender: gender,
      year_release: year_release,
      duration: duration,
      evaluation_note: evaluation_note,
      imageUrl: imageUrl
    }

    const newMovieStatus = await postNewMovie(movie);

    if (newMovieStatus) {
      toast.success('Filme adicionado com sucesso!')
    } else {
      toast.error('Erro ao tentar adicionar o filme!')
    }

    setIsModalAddOpen(false);
    setReRender(true);
  }

  const handleDeleteConfirm = async (id: number | undefined) => {
    const deleteMovieStatus = await deleteMovieId(id);

    if (deleteMovieStatus) {
      toast.success('Filme excluído com sucesso!')
    } else {
      toast.success('Erro ao tentar excluir o filme!')
    }

    setIsModalRequestDeleteOpen(false);
    setReRender(true);
  }

  const handleEditConfirm = async (title: string, description: string, gender: string, year_release: string, duration: string, evaluation_note: string | undefined, imageUrl: string, id: number | undefined) => {
    const editMovieStatus = await putMovieId(title, description, gender, year_release, duration, evaluation_note, imageUrl, id);

    if (editMovieStatus) {
      toast.success('Filme editado com sucesso!')
    } else {
      toast.error('Erro ao tentar editar o filme!')
    }

    setIsModalRequestEditOpen(false);
    setReRender(true);
  }
  
  // Search Input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilteredMovies(movies)
    setSearchValue(value);

    const searchText = value.toLowerCase();
    const filtered = movies.filter(movie => {
      return (
        movie.title.toLowerCase().includes(searchText) ||
        movie.description.toLowerCase().includes(searchText) ||
        movie.gender.toLowerCase().includes(searchText) ||
        movie.year_release.toString().includes(searchText) ||
        movie.duration.toLowerCase().includes(searchText) ||
        movie.evaluation_note?.toString().includes(searchText)
      );
    });

    setFilteredMovies(filtered);
  };

  // Rating 
  const createRatingNotes = (average: number[], index: number) => {
    if (average.length > 0) {
      return (
        <Stack spacing={1}>
          <Rating name={`rating-${index}`} defaultValue={Number(average[index])} precision={0.5} readOnly />
        </Stack>
      )
    }
  }

  return(
    <>
      <div className="moviesSection">
        <div className={`flex flex-wrap gap-3 justify-center overflow-x-hidden overflow-y-scroll ${movies.length > 8 ? 'md:h-670 h-auto' : ''} h-auto pt-12 md:pt-2 pb-2`}>
          {filteredMovies.map((movie, index) => (
            <Link to={`/movie/${username}/${movie.id}`} key={index}>
              <div className="movies bg-white p-3 rounded-xl w-96 hover:scale-105 cursor-pointer transition-all">
                <h1 className="text-center font-AntonSC text-tomato text-2xl mb-2">{movie.title}</h1>
                <hr className="border-tomato mb-2"/>
                <p className="overflow-x-hidden overflow-y-scroll h-36"><span className="font-semibold text-tomato">Descrição: </span>{movie.description}</p>
                <p><span className="font-semibold text-tomato">Gênero: </span>{movie.gender}</p>
                <p><span className="font-semibold text-tomato">Lançamento: </span>{movie.year_release}</p>
                <p><span className="font-semibold text-tomato">Duração: </span>{movie.duration}</p>
                <div className="flex mt-2 gap-1 items-center">
                  {movie && createRatingNotes(allAverage, index)}
                  <p className="text-xs text-gray-600">({allNotes[index].length} {allNotes[index].length > 1 ? 'avaliações' : 'avaliação'})</p>
                </div>
              </div>
            </Link>
          ))}
          {filteredMovies.length === 0 && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 m-1/2">
              <h1 className="text-tomato text-2xl bg-gray-700 p-4 rounded-3xl">Nenhum Filme Encontrado!</h1>
            </div>
          )}
        </div>
        <div className="flex absolute top-48 md:top-28 left-36 md:left-auto">
          <Button variant="contained" color="inherit" onClick={() => handleAddClick()}>
            <AddIcon fontSize="large" sx={{color: 'tomato'}}/>
          </Button>
          <Button className="left-2" variant="contained" color="inherit" onClick={() => handleEditClick()}>
            <EditIcon fontSize="large" sx={{color: 'tomato'}}/>
          </Button>
          <Button className="left-4" variant="contained" color="inherit" onClick={() => handleDeleteClick()}>
            <DeleteIcon fontSize="large" sx={{color: 'tomato'}}/>
          </Button>
        </div>
        <div className="absolute top-28 flex items-center w-96 right-10 bg-white ml-10 pl-7 pr-5 pb-3 pt-1 rounded-full">
          {/* Barra de pesquisa (filtro) */}
          <TextField color="primary" label='Pesquisar Filme' type="text" variant="standard" fullWidth size="small" value={searchValue} onChange={handleSearch}/>
          <SearchIcon className="-mb-2"/>
        </div>
        {isModalAddOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Adicionar novo filme</h2>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Título' size='small' fullWidth type='text' value={valeuTitleInput} onChange={(e) => setValeuTitleInput(e.target.value)} required autoComplete="off"/>

              <TextField multiline rows={5} sx={{marginBottom: '10px'}} variant='filled' label='Descrição' size='small' fullWidth type='text' value={valeuDescriptionInput} onChange={(e) => setValeuDescriptionInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Gênero' size='small' fullWidth type='text' value={valeuGenderInput} onChange={(e) => setValeuGenderInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Ano de lançamento' size='small' fullWidth type='text' value={valeuYearReleaseInput} onChange={(e) => setValeuYearReleaseInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Duração (Ex.: 2h10min)' size='small' fullWidth type='text' value={valeuDurationInput} onChange={(e) => setValeuDurationInput(e.target.value)} required autoComplete="off"/>
              
              <TextField sx={{marginBottom: '10px'}} variant='filled' label='URL da imagem' size='small' fullWidth type='text' value={valeuImageURLInput} onChange={(e) => setValeuImageURLInput(e.target.value)} required autoComplete="off"/>

              <div className="flex justify-end gap-1">
                <Button variant="contained" fullWidth color="error" onClick={() => hanldeCloseModal()}>
                    Cancelar
                </Button>
                <Button type="submit" variant="contained" fullWidth color="info" onClick={
                  () => handleAddConfirm(
                    valeuTitleInput,
                    valeuDescriptionInput,
                    valeuGenderInput,
                    valeuYearReleaseInput,
                    valeuDurationInput,
                    valeuEvaluationNoteInput,
                    valeuImageURLInput
                  )}>
                    Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}
        {isModalDeleteOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded shadow-lg w-96 relative">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold">Excluir filme</h2>
                <IconButton onClick={() => hanldeCloseModal()}>
                  <ClearIcon color="warning" />
                </IconButton>
              </div>
              <hr className="mb-3"/>

              <div className="overflow-y-scroll overflow-x-hidden max-h-96 pr-2">
                {movies.map((movie, index) => (
                  <div className="flex justify-between items-center bg-slate-200 p-1 rounded-md mb-2" key={index}>
                    <p>{movie.title}</p>
                    <IconButton onClick={() => deleteRequest(movie)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {isModalEditOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded shadow-lg w-96 relative">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold">Editar filme</h2>
                <IconButton onClick={() => hanldeCloseModal()}>
                  <ClearIcon color="warning" />
                </IconButton>
              </div>
              <hr className="mb-3"/>

              <div className="overflow-y-scroll overflow-x-hidden max-h-96 pr-2">
                {movies.map((movie, index) => (
                  <div className="flex justify-between items-center bg-slate-200 p-1 rounded-md mb-2" key={index}>
                    <p>{movie.title}</p>
                    <IconButton onClick={() => editRequest(movie)}>
                      <EditIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {isModalRequestEditOpen && seletectedMovie &&(
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Editar filme: {seletectedMovie.title}</h2>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Título' size='small' fullWidth type='text' value={valeuTitleInput} onChange={(e) => setValeuTitleInput(e.target.value)} required autoComplete="off"/>

              <TextField multiline rows={5} sx={{marginBottom: '10px'}} variant='filled' label='Descrição' size='small' fullWidth type='text' value={valeuDescriptionInput} onChange={(e) => setValeuDescriptionInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Gênero' size='small' fullWidth type='text' value={valeuGenderInput} onChange={(e) => setValeuGenderInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Ano de lançamento' size='small' fullWidth type='text' value={valeuYearReleaseInput} onChange={(e) => setValeuYearReleaseInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='Duração (Ex.: 2h10min)' size='small' fullWidth type='text' value={valeuDurationInput} onChange={(e) => setValeuDurationInput(e.target.value)} required autoComplete="off"/>

              <TextField sx={{marginBottom: '10px'}} variant='filled' label='URL da imagem' size='small' fullWidth type='text' value={valeuImageURLInput} onChange={(e) => setValeuImageURLInput(e.target.value)} required autoComplete="off"/>

              <div className="flex justify-end gap-1">
                <Button variant="contained" fullWidth color="error" onClick={() => hanldeCloseModal()}>
                    Cancelar
                </Button>
                <Button type="submit" variant="contained" fullWidth color="info" onClick={
                  () => handleEditConfirm(
                    valeuTitleInput,
                    valeuDescriptionInput,
                    valeuGenderInput,
                    valeuYearReleaseInput,
                    valeuDurationInput,
                    valeuEvaluationNoteInput,
                    valeuImageURLInput,
                    seletectedMovie.id
                  )}>
                    Salvar
                </Button>
              </div>
            </div>
          </div>
        )}
        {isModalRequestDeleteOpen && seletectedMovie && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-2">Confirmar exclusão</h2>
              <hr className="mb-2"/>

              <p className="bg-slate-200 p-1 mb-1 rounded-lg"><span className="font-semibold">Nome do filme:</span> {seletectedMovie.title}</p>
              <p className="bg-slate-200 p-1 mb-1 rounded-lg"><span className="font-semibold">ID do filme:</span> {seletectedMovie.id}</p>

              <div className="flex justify-end gap-1 mt-2">
                 <Button variant="contained" color="error" onClick={() => hanldeCloseModal()}>
                    Cancelar
                  </Button>
                  <Button variant="contained" color="info" onClick={() => handleDeleteConfirm(seletectedMovie.id)}>
                    Excluir
                  </Button>
               </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Movies;
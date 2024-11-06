import { Button, IconButton } from "@mui/material"
import logo from "../../../assets/images/logo.jpg"
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

import { Link, useParams } from "react-router-dom";

const Header = () => {
  const { username } = useParams();
  
  return(
    <>
      <div className="absolute flex justify-between items-center top-0 bg-white w-full p-2 pl-5 pr-5">
        <div className="flex items-center">
          <img className="h-16" src={logo} alt="logo" />
          <h1 className="cursor-default font-extrabold text-tomato">Movie Library</h1>
        </div>
        <div>
          <Link to={`/movies/recommended/${username}`}>
            <Button className="gap-1 lg:left-20 left-0" variant="text">
              Filmes Recomendados
              <CheckCircleOutlineIcon />
            </Button>
          </Link>
        </div>
        <div className="flex gap-5 items-center">
          <div className="gap-1 hidden md:flex text-gray-600 cursor-default">
            <PersonIcon />
            <p>Olá <span className="font-semibold">{username}</span></p>
          </div>
          <Link to={`/home/${username}`}>
            <IconButton className="gap-1">
              <HomeIcon />
            </IconButton>
          </Link>
          <Link to={'/'}>
            <Button className="gap-1" variant="contained">
              <LogoutIcon />
              Sair
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header
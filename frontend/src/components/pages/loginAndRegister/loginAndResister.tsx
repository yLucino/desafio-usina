import { Button, TextField } from "@mui/material";
import bg_cinema from "../../../assets/images/backgound-cinema.jpg";
import logo from "../../../assets/images/logo.jpg"
import { postLogin, postRegister } from "../../services/forLoginAndResgisterPage/loginAndRegiser.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginAndRegisterPage = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
  const navigate = useNavigate();
  const [ valeuUsernameInput, setValeuUsernameInput ] = useState('');
  const [ valeuPasswordInput, setValeuPasswordInput ] = useState('');
  const [ valeuNameInput, setValeuNameInput ] = useState('');
  const [ valeuCityInput, setValeuCityInput ] = useState('');
  const [ valeuStateInput, setValeuStateInput ] = useState('');
  const [ valeuCountryInput, setValeuCountryInput ] = useState('');
  const [ valeuTelephoneInput, setValeuTelephoneInput ] = useState('');

  const [ isModalLoginOpen, setIsModalLoginOpen ] = useState(true);
  const [ isModalRegisterOpen, setIsModalRegisterOpen ] = useState(false);

  localStorage.removeItem('authToken');

  const handleFormLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitLogin(valeuUsernameInput, valeuPasswordInput);
  }

  const handleFormRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitRegister(valeuUsernameInput, valeuPasswordInput, valeuNameInput, valeuCityInput, valeuStateInput, valeuCountryInput, valeuTelephoneInput);
  }

  const handleSubmitLogin = async (username: string, password: string) => {
    try {
      const response = await postLogin(username, password)
      
      if (response?.message === 'Login Successfully.') {
        onLoginSuccess(response.token);
        toast.success("Login feito com sucesso!");
        navigate(`/home/${valeuUsernameInput}`);
      } else {
        toast.error("Usuário/Senha incorreta ou inexistente!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitRegister = async (username: string, password: string, name: string, city: string, state: string, country: string, phone: string) => {
    try {
      const response = await postRegister(username, password, name, city, state, country, phone);
      
      if (response === 'New User added successfully.') {
        const response = await postLogin(username, password);

        if (response?.message === 'Login Successfully.') {
          onLoginSuccess(response.token);
          toast.success("Registro e Login feito com sucesso!");
          navigate(`/home/${valeuUsernameInput}`);
        } else {
          toast.error("Erro ao tentar fazer registro!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const toggleModal = () => {
    if (isModalLoginOpen) {
      setIsModalLoginOpen(false);
      setIsModalRegisterOpen(true);
    } else {
      setIsModalLoginOpen(true);
      setIsModalRegisterOpen(false);
    }
  }

  return(
    <div className="flex">
      <div className="relative">
        <div>
          <div className="flex items-center gap-2 absolute 2xl:left-40 sm:left-10 top-5">
            <img className="w-h-20 h-20 rounded-full  md:block hidden" src={logo} alt="Logo" />
            <h1 className="font-AntonSC text-8xl text-tomato sm:block hidden">Movie Library</h1>
          </div>
          <img className="h-screen object-cover md:w-auto w-500 sm:block hidden" src={bg_cinema} />
        </div>
        <div className="group absolute top-96 2xl:left-40 lg:left-40 max-w-2xl bg-white p-10 hover:bg-tomato hover:scale-105 transition-all shadow-2xl lg:block hidden w-2/3">
          <p>A <strong>Movie Library</strong> é uma plataforma pensada para quem ama o cinema e quer compartilhar experiências e descobertas. Nela, você pode adicionar filmes que já assistiu, criar uma coleção personalizada e avaliar cada título. Com essas avaliações, você ajuda outros cinéfilos a encontrar o próximo grande filme para assistir e, ao mesmo tempo, recebe recomendações especialmente sugeridas para o seu gosto, com base nas avaliações e preferências de outros usuários. Nossa biblioteca é um espaço interativo e colaborativo onde cada opinião conta, proporcionando uma experiência enriquecedora que conecta pessoas por meio do amor ao cinema.</p>
          <hr className="mt-5 border-tomato group-hover:border-white"/>
        </div>
      </div>
      <div className="2xl:w-1/3 lg:w-2/3 md:w-500 bg-white pl-5 pr-5 md:pl-20 md:pr-20 text-center">
          <div className="flex flex-col justify-evenly h-screen">
            {isModalLoginOpen && (
              <>
                <div>
                  <h2 className="text-3xl text-tomato font-extrabold">Bem-vindo de volta!</h2>
                </div>
                <div>
                  <p className="mb-2">Faça seu Login abaixo</p>
                  <form method="post" onSubmit={handleFormLoginSubmit}>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Usuário/E-mail' size='small' fullWidth type='text' value={valeuUsernameInput} onChange={(e) => setValeuUsernameInput(e.target.value)} required autoComplete="current-password"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Senha' size='small' fullWidth type='password' value={valeuPasswordInput} onChange={(e) => setValeuPasswordInput(e.target.value)} required autoComplete="current-password"/>
                    
                    <Button type="submit" variant="contained" fullWidth color="warning">
                      Entrar
                    </Button>
                  </form>
                  <p className="mt-2">
                    Não possui uma conta? 
                    <span className="text-tomato cursor-pointer hover:underline ml-1" onClick={() => toggleModal()}>Registre-se</span>
                  </p>
                </div>
              </>
            )}
            {isModalRegisterOpen && (
              <>
                <div>
                  <h2 className="text-3xl text-tomato font-extrabold">Faça seu Registro aqui!</h2>
                </div>
                <div>
                  <p className="mb-2">Faça seu registro abaixo</p>
                  <form method="post" onSubmit={handleFormRegisterSubmit}>
                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Nome Completo' size='small' fullWidth type='text' value={valeuNameInput} onChange={(e) => setValeuNameInput(e.target.value)} required autoComplete="off"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Usuário para acesso ou E-mail' size='small' fullWidth type='text' value={valeuUsernameInput} onChange={(e) => setValeuUsernameInput(e.target.value)} required autoComplete="off"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Cidade' size='small' fullWidth type='text' value={valeuCityInput} onChange={(e) => setValeuCityInput(e.target.value)} required autoComplete="off"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Estado' size='small' fullWidth type='text' value={valeuStateInput} onChange={(e) => setValeuStateInput(e.target.value)} required autoComplete="off"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='País' size='small' fullWidth type='text' value={valeuCountryInput} onChange={(e) => setValeuCountryInput(e.target.value)} required autoComplete="off"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Telefone' size='small' fullWidth type='text' value={valeuTelephoneInput} onChange={(e) => setValeuTelephoneInput(e.target.value)} required autoComplete="off"/>

                    <TextField sx={{marginBottom: '10px'}} variant='filled' label='Senha' size='small' fullWidth type='password' value={valeuPasswordInput} onChange={(e) => setValeuPasswordInput(e.target.value)} required autoComplete="off"/>
                    
                    <Button type="submit" variant="contained" fullWidth color="warning">
                      Registrar
                    </Button>
                  </form>
                  <p className="mt-2">
                    Já possui uma conta? 
                    <span className="text-tomato cursor-pointer hover:underline ml-1" onClick={() => toggleModal()}>Login</span>
                  </p>
                </div>
              </>
            )}
          </div>
      </div>
    </div>
  )
}

export default LoginAndRegisterPage;
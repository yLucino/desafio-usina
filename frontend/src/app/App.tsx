import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginAndRegisterPage from '../components/pages/loginAndRegister/loginAndResister';
import HomePage from '../components/pages/home/home';
import ProtectedRoute from '../components/protectedRoute';

import { useState } from 'react';
import MovieInfo from '../components/pages/moviesInfo/moviesInfo';
import RecommendedPage from '../components/pages/recommended/recommended';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };
  
  return (
    <Router>
      <ToastContainer autoClose={3500} position={"bottom-left"} />
      
      <Routes>
        <Route path='/' element={<LoginAndRegisterPage onLoginSuccess={handleLoginSuccess}/>}/>
        <Route path='/home/:username' element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path='/movie/:username/:id' element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MovieInfo />
          </ProtectedRoute>
        } />
        <Route path='/movies/recommended/:username' element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RecommendedPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>  
  )
}

export default App

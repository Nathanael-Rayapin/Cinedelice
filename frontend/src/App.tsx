import { Navigate, Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout/Layout'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Signup from './pages/Signup/Signup'
import Signin from './pages/Signin/Signin'
import Footer from './components/Footer/Footer'
import CGU from './pages/CGU/CGU'
import About from "./pages/About/About"
import Recipes from './pages/Recipes/Recipes'
import RecipeDetail from './pages/Recipe-Detail/Recipe-Detail'
import { useContext, useEffect } from 'react'
import Movies from './pages/Movies/Movies'
import { AuthContext } from './store/interface'
import MovieDetail from './pages/Movie-Detail/Movie-Detail'
import './App.css'

function App() {
  const authContext = useContext(AuthContext)
  const location = useLocation();

  // Remet la page en haut au chargement du composant
  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem('token');
    if (token) {
      authContext.setIsAuth(true);
    }
  }, [location.pathname, authContext]);

  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/pour-vous" replace />} />
          <Route path="/pour-vous" element={<Home />} />
          <Route path="/tendances" element={<Home />} />
          <Route path="/favoris" element={<Home />} />

          <Route path="/recettes" element={<Recipes />} />
          <Route path="/recettes/:id" element={<RecipeDetail />} />
          <Route path='/films' element={<Movies />} />
          <Route path="/films/:id" element={<MovieDetail />} />

          <Route path="/inscription" element={<Signup />} />
          <Route path="/connexion" element={<Signin />} />

          <Route path="/cgu" element={<CGU />} />
          <Route path="/à-propos" element={<About />} />

        </Routes>
      </Layout>
      <Footer />
    </>
  )
}

export default App

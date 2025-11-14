import { Navigate, Route, Routes, useLocation } from 'react-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from './store/interface';
import Layout from './components/Layout/Layout';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Signin from './pages/Signin/Signin';
import Footer from './components/Footer/Footer';
import CGU from './pages/CGU/CGU';
import About from './pages/About/About';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from './pages/Recipe-Detail/Recipe-Detail';
import Movies from './pages/Movies/Movies';
import Profile from './pages/Profile/Profile';
import MyRecipe from './pages/My-Recipes/My-Recipe';
import ForYou from './pages/For-You/For-You';
import MyInformations from './pages/My-Informations/My-Informations';
import MovieDetail from './pages/Movie-Detail/Movie-Detail';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  // Remet la page en haut au chargement du composant
  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem('token');
    if (token) {
      authContext.setIsAuth(true);
    }
  }, [location.pathname, authContext.isAuth]);

  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<Home />}>
            <Route index element={<Navigate to="pour-vous" replace />} />
            <Route path="pour-vous" element={<ForYou />} />
          </Route>

          {/* Recettes et Films */}
          <Route path="/recettes" element={<Recipes />} />
          <Route path="/recettes/:id" element={<RecipeDetail showDraft={false} />} />
          <Route path="/films" element={<Movies />} />
          <Route path="/films/:id" element={<MovieDetail />} />

          {/* Authentification */}
          <Route path="/inscription" element={<Signup />} />
          <Route path="/connexion" element={<Signin />} />

          {/* Routes Protégées - Mes recettes */}
          <Route element={<ProtectedRoute isAuthenticated={authContext.isAuth} />}>
            <Route path="/ma-recette/:id" element={<RecipeDetail showDraft={true} />} />
          </Route>

          {/* Routes Protégées - Mon Profil */}
          <Route element={<ProtectedRoute isAuthenticated={authContext.isAuth} />}>
            <Route path="/profil" element={<Profile />}>
              <Route index element={<Navigate to="mes-recettes" replace />} />
              <Route path="mes-recettes" element={<MyRecipe />} />
              <Route path="mes-informations" element={<MyInformations />} />
            </Route>
          </Route>

          {/* Autre */}
          <Route path="/cgu" element={<CGU />} />
          <Route path="/à-propos" element={<About />} />
        </Routes>
      </Layout>
      <Footer />
    </>
  );
}

export default App;

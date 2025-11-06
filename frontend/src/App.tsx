import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Signup from './pages/Signup/Signup'
import Signin from './pages/Signin/Signin'
import Footer from './components/Footer/Footer'
import CGU from './pages/CGU/CGU'
import About from "./pages/About/About"
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/pour-vous" replace />} />
          <Route path="/pour-vous" element={<Home />} />
          <Route path="/tendances" element={<Home />} />
          <Route path="/favoris" element={<Home />} />

          <Route path="/inscription" element={<Signup />} />
          <Route path="/connexion" element={<Signin />} />

          <Route path="/cgu" element={<CGU />} />
          <Route path="/about" element={<About />} />
          
        </Routes>
      </Layout>
      <Footer />
    </>
  )
}

export default App

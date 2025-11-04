import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Signup from './pages/Signup/Signup'
import Signin from './pages/Signin/Signin'
import Footer from './pages/Footer/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/pour-vous" replace />} />
          <Route path="/pour-vous" element={<Home />} />
          <Route path="/tendance" element={<Home />} />
          <Route path="/favoris" element={<Home />} />

          <Route path="/inscription" element={<Signup />} />
          <Route path="/connexion" element={<Signin />} />
        </Routes>
      </Layout>
      <Footer />
    </>
  )
}

export default App

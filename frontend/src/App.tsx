import { Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Signup from './pages/Signup/Signup'
import Signin from './pages/Signin/Signin'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/connexion" element={<Signin />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App

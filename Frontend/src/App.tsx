import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/Signup.tsx'
import Training from './pages/Training.tsx'
import Nutrition from './pages/Nutrition.tsx'
import Merchandising from './pages/Merchandising.tsx'

function App() {

  return (
  <>
    <div className='pageContainer'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/training' element={<Training />} />
        <Route path='/nutrition' element={<Nutrition />} />
        <Route path='/merchandising' element={<Merchandising />} />
      </Routes>
    </div>
  </>

  )
}

export default App

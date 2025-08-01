import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Training from './pages/Training.tsx'
import Merchandising from './pages/Merchandising.tsx'
import Account from './pages/Account.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/account' element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
          } />
        <Route path='/training' element={<Training />} />
        <Route path='/merchandising' element={<Merchandising />} />
      </Routes>
    </>
  )
}

export default App

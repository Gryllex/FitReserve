import { Link, useNavigate } from "react-router-dom"
import '../css-styles/account.css'

export default function Account () {
    const navigate = useNavigate()
    const handleLogout = async () => {
        const response = await fetch('http://localhost:4000/api/auth/logout', {
            method: 'POST',
            credentials: "include"
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error)
        }

        const data = await response.json()
        console.log('Logout successfully', data)

        
        navigate('/')

    }

    return(
        <>
            <div className="navbar-logo-container">
                <Link to='/'>
                    <img className="loginLogo" src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                </Link>
            </div>
            <div className="provisional-body">Protected route for logged users
                <button onClick={handleLogout}>Logout</button>
            </div>

        </>
    )
}
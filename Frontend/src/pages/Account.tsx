import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"
import '../css-styles/account.css'

export default function Account () {
    const navigate = useNavigate()
    const { isAuthenticated, loading, logoutUser }= useAuth()

    useEffect(()=>{
        if (!loading && !isAuthenticated) {
            navigate('/login')
        }
    }, [loading, isAuthenticated])

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/auth/logout', {
                method: 'POST',
                credentials: "include"
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message)
            }

            const data = await res.json()

            logoutUser()
            console.log('Logout successfully', data)
            navigate('/')

        } catch (e) {
            alert('Logout error')
            console.error(e)
        }
    };

    if (loading) return <p className="loading-text">Loading...</p>

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
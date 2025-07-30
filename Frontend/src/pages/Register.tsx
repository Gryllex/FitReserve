import { Link, useNavigate } from "react-router-dom"
import { RegisterCard } from "../components/RegisterCard"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"


export default function Register () {
    // Redirect to /account if user is already logged in
    const navigate = useNavigate()
    const { isAuthenticated, loading } = useAuth()
    
    useEffect(()=>{
        if (isAuthenticated) {
            navigate('/account')
        }
    },[isAuthenticated, navigate])

    const handleRegister = async ({ name, email, password, role, daysOfWeek, startTime, endTime }:
      { name: string, email: string, password: string, role: string, daysOfWeek?: Array<number>, startTime?: number, endTime?: number}) => {
        try {

            const requestData = role === 'TRAINER' ? { name, email, password, role: 'TRAINER', daysOfWeek, startTime, endTime } : { name, email, password, role: 'CLIENT'}
            console.log(JSON.stringify(requestData))
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-type' : 'application/json'},
                body: JSON.stringify(requestData),
                credentials: 'include'
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data)
            }

            console.log('Register successful', data)
            navigate('/account')

        } catch(e) {
            console.error('Error during register', e)
        }
    }

    if (loading) return <p className="loading-text">Loading...</p>

    return(
        <>
            <div className="navbar-logo-container">
                <Link to='/'>
                    <img className="loginLogo" src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                </Link>
            </div>
            < RegisterCard onRegister={handleRegister} />
        </>
    )
}
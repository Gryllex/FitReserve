import { Link, useNavigate } from "react-router-dom"
import { LoginCard } from "../components/LoginCard"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"

export default function Login () {
    // Redirect to /account if user is already logged in
    const navigate = useNavigate()
    const { isAuthenticated, loading, loginUser } = useAuth()
    
    useEffect(()=>{
        if (isAuthenticated) {
            navigate('/account')
        }
    },[isAuthenticated, navigate])

    const [errorMessage, setErrorMessage] = useState<string>()

    const handleLogin = async ({ email, password }: {email: string, password: string}) => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-type' : 'application/json'},
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            const data = await response.json()
            if (!response.ok){
                throw new Error(data.error || 'Login failed')
            }

            loginUser(data.user)
            console.log('Login successful', data)
            navigate('/account')

        } catch {
            setErrorMessage('Invalid email or password')
            // console.error('Error during login', e)
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
            < LoginCard onLogin={handleLogin} errorMessage={errorMessage} />
        </>
    )
}
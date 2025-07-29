import { Link, useNavigate } from "react-router-dom"
import { LoginCard } from "../components/LoginCard"

export default function Login () {
    const navigate = useNavigate()
    const handleLogin = async ({ email, password }: {email: string, password: string}) => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-type' : 'application/json'},
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            if (!response.ok){
                const error = await response.json()
                throw new Error(error.message || 'Login failed')
            }

            const data = await response.json()
            console.log('Login successful', data)

            navigate('/account')

        } catch(e) {
            console.error('Error during login', e)
        }
    }

    return(
        <>
            <div className="navbar-logo-container">
                <Link to='/'>
                    <img className="loginLogo" src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                </Link>
            </div>
            < LoginCard onLogin={handleLogin} />
        </>
    )
}
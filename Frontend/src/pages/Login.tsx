import { Link } from "react-router-dom"
import { LoginCard } from "../components/LoginCard"

export default function Login () {
    return(
        <>
            <div className="navbar-logo-container">
                <Link to='/'>
                    <img className="loginLogo" src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                </Link>
            </div>
            < LoginCard />
        </>
    )
}
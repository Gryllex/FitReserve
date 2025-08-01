import { Link } from "react-router-dom";
import '../css-styles/header.css'
import { useAuth } from "../hooks/useAuth";

export function Header () {
    const { isAuthenticated } = useAuth()

    return (
            <header className="main-page-header">
                <div className="header-wrapper">
                    {/* MAIN NAV */}
                    <nav className="left-header">
                        <Link to='/'>
                            <img src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                        </Link>
                        <Link to='/training' >Training</Link>
                        <Link to='/merchandising' >Merchandising</Link>
                    </nav>

                    {/* USER CREATE AND LOGIN */}
                    <nav className="right-header">

                        { !isAuthenticated && <>
                            <Link to='/login'>Login</Link>
                            <Link to='/register' >
                                <button>Register</button>
                            </Link>
                        </> }
                        { isAuthenticated &&
                            <Link to='/account'>
                                <button>Account</button>
                            </Link>
                        }
                    </nav>
                </div>
            </header>
    )
}
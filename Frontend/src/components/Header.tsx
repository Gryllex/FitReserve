import { Link } from "react-router-dom";
import '../css-styles/Header.css'

export function Header () {
    return (
            <header>
                <div className="header-wrapper">
                    {/* MAIN NAV */}
                    <nav className="left-header">
                        <Link to='/'>
                            <img src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                        </Link>
                        <Link to='/training' >Training</Link>
                        <Link to='/nutrition' >Nutrition</Link>
                        <Link to='/merchandising' >Merchandising</Link>
                    </nav>

                    {/* USER CREATE AND LOGIN */}
                    <nav className="right-header">
                        <Link to='/login' >Login</Link>
                        <Link to='/signup' >
                            <button>Sign Up</button>
                        </Link>
                    </nav>
                </div>
            </header>
    )
}
import { Link } from "react-router-dom";
import '../css-styles/header.css'
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export function Header () {
    const { isAuthenticated } = useAuth()
    const [mobileCheckbox, setMobileCheckbox] = useState<boolean>(false)

    return (
            <header className="main-page-header">
                {/* MOBILE CHECKBOX */}
                <div className="header-mobile-checkbox-container">
                    <label htmlFor="header-mobile-checkbox">
                        <img src={ mobileCheckbox ? '../src/assets/menu-bar-x.png' : '../src/assets/menu-bar.png'} alt="" />
                    </label>
                    <input type="checkbox" id="header-mobile-checkbox"
                        checked={mobileCheckbox}
                        onChange={()=>{setMobileCheckbox(!mobileCheckbox)}}
                    />
                </div>

                {/* LOGO */}
                <div className="header-logo">
                    <Link to='/'>
                        <img src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                    </Link>
                </div>
                <div  className={mobileCheckbox ? 'header-wrapper display-mobile-header' : 'header-wrapper'}>
                    {/* MAIN NAV */}
                    <nav className="left-header">
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
import { Link } from "react-router-dom"
import { Header } from "../components/Header"
import '../css-styles/home.css'

export default function Home () {
    return(
        <>
            < Header />
            <div className="page-container">
                {/* <main className="home-main-section home-section">
                </main> */}

                    <section className="main-section home-section">
                        <div className="main-section-info">
                            <h1 className="hero-title">
                                Find your <span>personal trainer</span> and book your next session within minutes!
                            </h1>
                            <p>
                                We connect clients and trainers quickly and easily, Sign up today, book workouts as a client or grow your business as a trainer
                            </p>
                            <Link to='/register' >
                                <button>Join now</button>
                            </Link>
                        </div>
                    </section>


                {/* SPONSORS */}
                <section className="sponsor-section home-section">
                    <div className="sponsor-container">
                        <img src="../src/assets/sponsors1.png" alt="" />
                        <img src="../src/assets/sponsors2.png" alt="" />
                    </div>
                </section>


                <section className="training-benefits home-section">
                    <div className="training-benefits__card-container">
                        <div className="training-benefits__card">
                            <img src="../src/assets/muscle-hypertrophy.png" alt=""/>
                            <p>Muscle hypertrophy</p>
                        </div>
                        <div className="training-benefits__card">
                            <img src="../src/assets/build-strength.png" alt=""/>

                            <p>Build strength</p>
                        </div>
                        <div className="training-benefits__card">
                            <img src="../src/assets/improve-posture.png" alt=""/>

                            <p>Improved Balance & Posture</p>
                        </div>
                        <div className="training-benefits__card">
                            <img src="../src/assets/motivation.png" alt=""/>
                            <p>Motivation</p>
                        </div>
                        <div className="training-benefits__card">
                            <img src="../src/assets/mental-health.png" alt=""/>
                            <p>Mental health</p>
                        </div>
                        <div className="training-benefits__card">
                            <img src="../src/assets/cardiovascular-health.png" alt=""/>
                            <p>Cardiovascular Health</p>
                        </div>
                    </div>
                </section>
                <section className="home-section"></section>
            </div>
        </>
    )
}

import { Link } from 'react-router-dom'
import '../css-styles/account-dashboard.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { MyDashboard } from './dashboard-sections/MyDashboard'
import { BookedSessions } from './dashboard-sections/BookedSessions'
import { WorkingSchedule } from './dashboard-sections/WorkingSchedule'
import { BookSession } from './dashboard-sections/BookSession'

type LogoutProps = {
    handleLogout: () => void
}

const clientSections = [
    'My Dashboard', 'Booked Sessions', 'Book Session'
]

const trainerSections = [
    'My Dashboard', 'Working Schedule', 'Booked Sessions'
]


export function AccountDashboard({ handleLogout }: LogoutProps ) {
    const { user } = useAuth()
    const [sidebarSections, setSidebarSections] = useState<string[]>([]) 
    const [activeSection, setActiveSection] = useState<string>('My Dashboard')

    useEffect(()=>{
        const sections =  user?.role === 'TRAINER' ? trainerSections: clientSections

        setSidebarSections(sections)
        setActiveSection(sections[0])
    },[user])

    return (
        <div className='dashboard-container'>
            <aside className="dashboard-sidebar">
                <nav>
                    <Link to='/'>
                        <img className="loginLogo" src="https://static.vecteezy.com/system/resources/previews/026/109/417/original/gym-logo-fitness-health-muscle-workout-silhouette-design-fitness-club-free-vector.jpg" alt="Logo" />
                    </Link>

                    <ul className='dashboard-list'>
                        { sidebarSections.map(section => (
                            <li 
                            key={section}
                            className={`dashboard-list-item
                                ${section === activeSection ? 'dashboard-selected-list-item': '' }`}
                            onClick={() => setActiveSection(section)}
                            >
                                {section}
                            </li>
                        ))}
                    </ul>
                </nav>
                <button onClick={handleLogout}>Logout</button>
            </aside>
            <div className="dashboard-main-wrapper">
                <header className='dashboard-header'>Welcome! {}</header>
                <main className='dashboard-main'>
                        { activeSection === 'My Dashboard' && <MyDashboard />}
                        { activeSection === 'Booked Sessions' && <BookedSessions />}
                        { activeSection === 'Book Session' && <BookSession />}
                        { activeSection === 'Working Schedule' && <WorkingSchedule />}
                </main>
            </div>
        </div>
    )
}
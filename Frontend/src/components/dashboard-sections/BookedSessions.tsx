import { useEffect, useMemo, useState } from "react"
import type { User } from "../../types/types"
import { capitalizeFirst, durationToStr, formatDate } from "../../utils/utils"

type BookedSessionsProps = {
    user: User | null
}

type Session = {
    id: number,
    userName: string,
    userEmail: string,
    duration: string,
    date: string,
    cancelled: boolean
}

type Trainer = {
  name: string;
  email: string;
}

type Client = {
  name: string;
  email: string;
}

type SessionDB = {
  cancelled: boolean;
  clientId: number;
  createdAt: string;  // ISO date string
  date: string;       // ISO date string
  duration: number;
  id: number;
  trainer: Trainer;
  client: Client;
  trainerId: number;
}

type Filters = {
    show: 'ALL' | 'ACTIVE' | 'CANCELLED';
}


export function BookedSessions({ user }: BookedSessionsProps ) {
    const [sessions, setSessions] = useState<Session[]>([])
    const [filters, setFilters] = useState<Filters>({
        show: 'ALL'
    })

    const endPoint = user?.role === 'TRAINER' 
        ? 'http://localhost:4000/api/trainer/me/sessions' 
        : 'http://localhost:4000/api/client/me/sessions' 
    
    useEffect(()=>{
        fetchSessions()
    },[])

    const fetchSessions = async () => {
        try {
            const res = await fetch(endPoint, { credentials: 'include' });
            const data = await res.json()
            if (!res.ok) { throw new Error(data.error || 'Error retrieving sessions')}

            const mappedSessions = data.sessions.map((session: SessionDB) => {
                const userName = user?.role === 'TRAINER' ? session.client.name : session.trainer.name
                const userEmail = user?.role === 'TRAINER' ? session.client.email : session.trainer.email
                const duration = durationToStr(session.duration)
                const date = formatDate(session.date)

                const addSession: Session = {
                        id: session.id,
                        cancelled: session.cancelled,
                        userName: capitalizeFirst(userName),
                        userEmail: userEmail,
                        duration: duration,
                        date: date,
                }

                return addSession
            })

            setSessions(mappedSessions)

        } catch(e) {
            console.error(e);
        }
    }
        

    const filteredSessions = useMemo(()=>{
        if (filters.show === 'ALL') return sessions

        return sessions.filter(session => 
            filters.show === 'CANCELLED' ? session.cancelled : !session.cancelled  
        )

    }, [sessions, filters])


    const cancelSession = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:4000/api/client/sessions/${id}`, {
                method: 'PUT',
                credentials: 'include'
            });

            const data = await res.json()
            if (!res.ok) { throw new Error(data.error) }

            fetchSessions()
    
        } catch(e) {
            console.error(e)
        }
    }    

    const roleLabel = user?.role === 'TRAINER' ? 'Client' : 'Trainer'
    
    return (
        <div className="dashboard-section dashboard-booked-sessions-container">
            <h2>Booked Sessions</h2>
            <div className="dashboard-filters-container">

                <button onClick={()=>setFilters({show: 'ALL'})}
                    className={ filters.show == 'ALL' ? 'dashboard-selected-filter-button' : ''}    
                >Show All sessions</button>

                <button onClick={()=>setFilters({show: 'ACTIVE'})}
                    className={ filters.show === 'ACTIVE' ? 'dashboard-selected-filter-button' : ''}    
                >Show Active sessions</button>

                <button onClick={()=>setFilters({show: 'CANCELLED'})}
                    className={ filters.show === 'CANCELLED' ? 'dashboard-selected-filter-button' : ''}    
                >Show Cancelled sessions</button>
            </div>


            <div className="dashboard-session-container-wrapper">
            {/* Render if there are no active or cancelled sessions */}
                {filteredSessions.length === 0 && (
                    <p className="dashboard-session-container">
                        No {filters.show.toLowerCase()} sessions available
                    </p>
                )}

            {/* Render sessions */}
                {filteredSessions && filteredSessions.map((session) => (
                    <div key={session.id} className="dashboard-session-container">
                        <h4>
                            {roleLabel}: {session.userName}
                        </h4>
                        <p>
                            {session.userEmail}
                        </p>
                        <div className="dashboard-divisor"></div>
                        <div className="dashboard-session">
                            <div className="dashboard-session-details">
                                <p>{session.date}</p>
                                <p>{session.duration}</p>

                                {session.cancelled ? (
                                    <span>Cancelled</span>
                                ) : (
                                    <button 
                                        className='dashboard-button'
                                        onClick={()=>cancelSession(session.id)}
                                    >X</button>
                                )}
                            </div>
                        </div>
                    </div>
                    ))
                }
            </div>
        </div>
    )
}
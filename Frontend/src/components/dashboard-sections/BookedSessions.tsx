import { useEffect, useState } from "react"
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


export function BookedSessions({ user }: BookedSessionsProps ) {
    const [sessions, setSessions] = useState<Session[]>([])

    const getSessionsFetch = user?.role === 'TRAINER' 
        ? 'http://localhost:4000/api/trainer/me/sessions' 
        : 'http://localhost:4000/api/client/me/sessions' 
    
    const getSessions = async () => {
        try {
            const res = await fetch(getSessionsFetch, {
                credentials: 'include'
            });

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Error retrieving sessions')
            }

            const sessions = data.sessions.map((session: SessionDB) => {
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

            setSessions(sessions)

        } catch(e) {
            console.error(e);
        }
    }
        
    useEffect(()=>{
        getSessions()
    },[])
    
    
    

    
    return (
        <>
            {sessions.map((session) => (
                <div key={session.id} className="dashboard-session-container">
                    <h4> { user?.role === 'TRAINER' && <>Client: </>}
                         { user?.role === 'CLIENT' && <>Trainer: </>}
                        {session.userName} - {session.userEmail}
                    </h4>
                    <div className="dashboard-session">
                        <div className="dashboard-session-details">
                            <p>{session.duration}</p>
                            <p>{session.date}</p>
                            <button className="dashboard-button">X</button>
                        </div>
                    </div>
                </div>
                ))
            }
    </>)
}
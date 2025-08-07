import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { AccountDashboard } from "../components/AccounDashboard"
import { useEffect, useState } from "react"
import type { User } from "../types/types"

export default function Account () {
    const navigate = useNavigate()
    const { logoutUser } = useAuth()
    const [user, setUser] = useState<User | null>(null)

    const getCurrentUser = async () => {
        try {

            const res = await fetch('http://localhost:4000/api/user/me', {
                credentials: 'include'
            })

            const data = await res.json()

            if (!res.ok || !data.user) {
                throw new Error(data.error || 'Error retrieving user');
            }

            const { id, email, role } = data.user

            setUser({ userId: id, email, role })        

        } catch (e) {
            console.error(e)
        }
    }

    useEffect(()=>{
        getCurrentUser()        
    },[])


    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/auth/logout', {
                method: 'POST',
                credentials: "include"
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message)
            }

            const data = await res.json()

            logoutUser()
            console.log('Logout successfully', data)
            navigate('/')

        } catch (e) {
            alert('Logout error')
            console.error(e)
        }
    };

    return(
        <>
            <AccountDashboard handleLogout={handleLogout} user={user}/>
        </>
    )
}
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { AccountDashboard } from "../components/AccounDashboard"

export default function Account () {
    const navigate = useNavigate()
    const { logoutUser } = useAuth()

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
            <AccountDashboard handleLogout={handleLogout} />
        </>
    )
}
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"


type ProtectedProps = {
    children: React.ReactNode
}

export function ProtectedRoute ({ children }: ProtectedProps) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <p>Loading...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace/>
    }

    return <>{ children }</>
}
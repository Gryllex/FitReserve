import { createContext, useEffect, useState, type ReactNode } from "react";

type User = {
    userId: number,
    email: string,
    role: 'CLIENT' | 'TRAINER'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean,
  loginUser: (userData: User) => void,
  logoutUser: () => void
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ( { children }: AuthProviderProps ){
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(()=>{
        const checkAuth = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/auth/authentication', {
                    credentials: 'include'
                });

                if (res.status === 401) {
                    setUser(null)
                    return
                }

                if (!res.ok){
                    console.warn(`Unexpected status: ${res.status}`)
                    return
                }
 
                const data = await res.json()
                setUser(data.user)

            } catch(e) {
                console.warn('Auth check failed: ', e)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    },[])

    const loginUser = (userData: User) => {
        setUser(userData)
    }

    const logoutUser = () => {
        setUser(null)
    }

    const isAuthenticated = user !== null

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logoutUser }}>
            { children }
        </AuthContext.Provider>
    )
}


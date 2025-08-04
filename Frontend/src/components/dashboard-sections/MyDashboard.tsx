import { useEffect, useState } from "react";

type User = {
    username: string,
    id: number,
    email: string,
    role: string
};

export function MyDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [changePassword, setChangePassword] = useState<string>('');
    const [confirmChangePassword, setConfirmChangePassword] = useState<string>('');

    useEffect(()=>{

        const getUser = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/user/me', {
                credentials: "include"
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Error during fetch');
                }

                const { user } = data;
                setUser({
                    username: user.name,
                    id: user.id,
                    email: user.email,
                    role: user.role
                });
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        } 
        
        getUser();

    },[]);

    useEffect(()=>{
        if (success) setSuccess('')
    },[changePassword,confirmChangePassword])


    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (changePassword !== confirmChangePassword) {
            setError('Passwords do not match')
            return
        } else {
            setError('')
        }

        if (changePassword.length <= 5) {
            setError('Password must be at least 6 characters long')
            return
        }

        try {
            const res = await fetch('http://localhost:4000/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-type' : 'application/json'},
                body: JSON.stringify({ password: changePassword }),
                credentials: "include"
                })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error during password change')
            }

            setError('')
            setChangePassword('')
            setConfirmChangePassword('')
            setSuccess('Password updated successfully')
        } catch(e) {
            if (e instanceof Error) {
                setError(e.message)
                console.error(e.message)
            }
        }
    }


    if (loading) return <p>Loading...</p>

    return (
        <ul className="dashboard-user-data">
            <li>
                <h4>Username</h4>
                <p>{user?.username}</p>
            </li>

            <li>
                <h4>User ID</h4>
                <p>{user?.id}</p>
            </li>

            <li>
                <h4>Email</h4>
                <p>{user?.email}</p>
            </li>

            <li>
                <h4>Role</h4>
                <p>{user?.role}</p>
            </li>
            
            <li>    
                <h4>Password</h4>

                <form onSubmit={(e) => handleChangePassword(e)}>
                    <input type="password" className="change-password" placeholder="Type a new password"
                        value={changePassword}
                        onChange={(e) => setChangePassword(e.target.value)}
                    />
                    
                    { changePassword && <>
                        <input type="password" className="change-password" placeholder="Confirm password"
                        value={confirmChangePassword}
                        onChange={(e) => setConfirmChangePassword(e.target.value)}/>

                        <button type="submit" >Confirm password change</button>   
                    </>}
                </form>
            </li>
            { error && <p className="dashboard-error">{error}</p>}
            { success && <p className="dashboard-success">{success}</p>}
        </ul>
    )
}
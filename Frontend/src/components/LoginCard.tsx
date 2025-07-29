import { Link } from 'react-router-dom'
import '../css-styles/login-register.css'
import { useState } from 'react'

type LoginData = {
    email: string;
    password: string;
}

type LoginCardProps = {
    onLogin: (data: LoginData) => void
}

export function LoginCard({ onLogin }: LoginCardProps ) {
    const [userEmail, setUserEmail] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
        
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onLogin({ email: userEmail, password: userPassword})
        console.log('Email: ', userEmail)
        console.log('Password: ', userPassword)
    }

    return (
        <div className="login-card">
            <h2>Log in</h2>
            <div className='login-form-container'>
                <form id='login-form' className="login-form" onSubmit={handleSubmit}>
                    <div className='login-form-email'>
                        <label htmlFor='login-email'>Email</label>
                        <input id='login-email' required type="email" className='login-email' placeholder='example@gmail.com'
                            value={userEmail}
                            onChange={(e)=>setUserEmail(e.target.value)}/>
                    </div>
                    <div className='login-form-password'>
                        <label htmlFor='login-password'>Password</label>
                        <input id='login-password' required type="password" className='login-password' placeholder='**********'
                            value={userPassword}
                            onChange={(e)=>setUserPassword(e.target.value)}/>
                    </div>
                    <div>
                        <button type="submit" className='login-submit'>Send</button>
                    </div>
                    <div>
                        <p>Still no account?</p>
                        <Link to='/register'>Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
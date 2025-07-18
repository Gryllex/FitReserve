import { Link } from 'react-router-dom'
import '../css-styles/login-signup.css'

export function LoginCard() {
    return (
        <div className="login-card">
            <h2>Log in</h2>
            <div className='login-form-container'>
                <form id='login-form' className="login-form">
                    <div className='login-form-email'>
                        <label>Email</label>
                        <input required type="text" className='login-email' placeholder='example@gmail.com' />
                    </div>
                    <div className='login-form-password'>
                        <label>Password</label>
                        <input required type="password" className='login-password' placeholder='**********' />
                    </div>
                    <div>
                        <button type="submit" className='login-submit'>Send</button>
                    </div>
                    <div>
                        <p>Still no account?</p>
                        <Link to='/signup'>Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
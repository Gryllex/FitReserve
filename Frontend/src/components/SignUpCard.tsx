import { Link } from 'react-router-dom'
import '../css-styles/login-signup.css'

export function SignUpCard() {
    return (
        <div className="login-card">
            <h2>Sign up</h2>
            <div className='login-form-container'>
                <form id='signup-form' className="login-form">
                    <div>
                        <label>Username</label>
                        <input required type="text" className='signup-username' placeholder='John' />
                    </div>
                    <div className='login-form-email'>
                        <label>Email</label>
                        <input required type="text" className='signup-email' placeholder='example@gmail.com' />
                    </div>
                    <div className='login-form-password'>
                        <label>Password</label>
                        <input required type="password" className='signup-password' placeholder='**********' />
                    </div>
                    <div className='login-form-password'>
                        <label>Confirm password</label>
                        <input required type="password" className='signup-confirm-password' placeholder='**********' />
                    </div>
                    <div>
                        <button type="submit" className='signup-submit'>Send</button>
                    </div>
                    <div>
                        <p>Already have an account?</p>
                        <Link to='/login'>Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
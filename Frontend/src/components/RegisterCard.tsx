import { Link } from 'react-router-dom'
import '../css-styles/login-register.css'
import { useState } from 'react'
import { RegisterTrainer } from './RegisterTrainer'

type RegisterData = {
    name: string,
    email: string,
    password: string,
    role: string,
    daysOfWeek?: Array<number>,
    startTime?: number,
    endTime?: number
}

type RegisterCardProps = {
    onRegister: (data: RegisterData) => void
}

type Role = 'CLIENT' | 'TRAINER'

type Schedule = {
    daysOfWeek?: number[],
    startTime?: number,
    endTime?: number
};

export function RegisterCard({ onRegister }: RegisterCardProps) {
    // User
    const [username, setUsername] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [userRole, setUserRole] = useState<Role>('CLIENT')

    // Trainer 
    const [newSchedule, setNewSchedule] = useState<Schedule>({});

    // Form
    const [showErrors, setShowErrors] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')


    // Check if user wants to register as trainer or as a client (default)
    const handleRole = () => {
        setUserRole((prev)=> prev === 'CLIENT' ? 'TRAINER' : 'CLIENT')
    }


    // Submit logic
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (username.length < 4) {
            setErrorMessage('Username must be at least 4 characters long');
            setShowErrors(true);
            return
        }
        
        if (userPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            setShowErrors(true);
            return
        }

        if (userRole === 'TRAINER' && !newSchedule?.daysOfWeek?.length) {
            setErrorMessage('Must select at least day');
            setShowErrors(true);
            return
        }

        if (userRole === 'TRAINER' && 
            (!newSchedule?.startTime || !newSchedule?.endTime || newSchedule?.startTime >= newSchedule?.endTime)) {
            setErrorMessage('Please set a valid schedule (start must be before end)');
            setShowErrors(true);
            return
        }

        setErrorMessage('');
        setShowErrors(false);


        const registerUser = { name: username, email: userEmail, password: userPassword, role: 'CLIENT'}
        const registerTrainer = { 
            name: username, email: userEmail, password: userPassword, role: 'TRAINER',
            daysOfWeek: newSchedule.daysOfWeek, startTime: newSchedule.startTime, endTime: newSchedule.endTime
        }
        onRegister( userRole === 'TRAINER' ? registerTrainer : registerUser)
    }

    

    // Render HTML
    return (
        <div className="login-card">
            <h2>Register</h2>
            <div className='login-form-container'>
                <form id='register-form' className="login-form" onSubmit={handleSubmit}>

                    {/* Username */}
                    <div>
                        <label>Username</label>
                        <input required type="text" className='register-username' placeholder='John'
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)}
                        />
                    </div>


                    {/* Email */}
                    <div className='login-form-email'>
                        <label>Email</label>
                        <input required type="email" className='register-email' placeholder='example@gmail.com'
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </div>


                    {/* Password */}
                    <div className='login-form-password'>
                        <label>Password</label>
                        <input required type="password" className='register-password' placeholder='**********'
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        />
                    </div>
                    <div className='login-form-password'>
                        <label>Confirm password</label>
                        <input required type="password" className='register-confirm-password' placeholder='**********'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>


                    {/* Register as trainer checkbox */}
                    <div>
                        <label id='register-trainer-label'>
                            <input type="checkbox" id='register-trainer-checkbox'
                                onChange={handleRole}
                            />
                            Register as trainer</label>
                    </div>

                    { userRole === 'TRAINER' && 
                      <RegisterTrainer onChange={setNewSchedule} />
                    }

                    {/* Error messages */}
                    { showErrors &&
                        <p className='register-error'>{errorMessage}</p>
                    }


                    {/* Submit button */}
                    <div>
                        <button type="submit" className='login-submit'>Send</button>
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
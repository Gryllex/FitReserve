import { Link } from 'react-router-dom'
import '../css-styles/login-register.css'
import { useState } from 'react'

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

export function RegisterCard({ onRegister }: RegisterCardProps) {
    // User
    const [username, setUsername] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [userRole, setUserRole] = useState<Role>('CLIENT')

    // Trainer 
    const [trainerDays, setTrainerDays] = useState<number[]>([])
    const [trainerStartTime, setTrainerStartTime] = useState<number>()
    const [trainerEndTime, setTrainerEndTime] = useState<number>()

    // Form
    const [startTimeString, setStartTimeString] =useState<string>('')
    const [endTimeString, setEndTimeString] =useState<string>('')
    const [showErrors, setShowErrors] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')


    // Check if user wants to register as trainer or as a client (default)
    const handleRole = () => {
        setUserRole((prev)=> prev === 'CLIENT' ? 'TRAINER' : 'CLIENT')
    }



    // Trainer's schedule work days
    const weekDays = [
        { day: 'Monday', dayValue: 1},
        { day: 'Tuesday', dayValue: 2},
        { day: 'Wednesday', dayValue: 3},
        { day: 'Thursday', dayValue: 4},
        { day: 'Friday', dayValue: 5},
        { day: 'Saturday', dayValue: 6},
        { day: 'Sunday', dayValue: 0},
    ]

    const handleCheckboxChange = (dayValue: number, checked: boolean) => {
        setTrainerDays((prev) => 
            checked
            ? [...prev, dayValue]    // Add
            : prev.filter((value) => value !== dayValue) // Remove    
        )   
    }



    // Trainer's schedule start time and end time
    const handleTime = ( type: 'startTime' | 'endTime', timeValue: string) => {
        const [hourStr, minuteStr] = timeValue.split(':')
        const hour = Number(hourStr)
        const minutes = Number(minuteStr)

        const time = hour*60 + minutes

        if (type === 'startTime') {
            setTrainerStartTime(time) 
            setStartTimeString(timeValue)
        } 
        if (type === 'endTime') {
            setTrainerEndTime(time)
            setEndTimeString(timeValue)
        }
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
        
        if (userRole === 'TRAINER' && trainerDays.length === 0) {
            setErrorMessage('Must select at least day');
            setShowErrors(true);
            return
        }

        if (userRole === 'TRAINER' && 
            (!trainerStartTime || !trainerEndTime || trainerStartTime >= trainerEndTime)) {
            setErrorMessage('Please set a valid schedule (start must be before end)');
            setShowErrors(true);
            return
        }

        setErrorMessage('');
        setShowErrors(false);


        const registerUser = { name: username, email: userEmail, password: userPassword, role: 'CLIENT'}
        const registerTrainer = { name: username, email: userEmail, password: userPassword, role: 'TRAINER', daysOfWeek: trainerDays, startTime: trainerStartTime, endTime: trainerEndTime }
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


                    {/* Trainer availability days, startTime, endTime */}
                    { userRole === 'TRAINER' && 
                      <>
                        <p>Working days</p>
                        <div className='trainerDays'>
                            {weekDays.map(({ day, dayValue }) => (
                                <label key={dayValue}>
                                    {day}
                                    <input type="checkbox" 
                                        value={dayValue}
                                        checked={trainerDays.includes(dayValue)}
                                        onChange={(e)=>handleCheckboxChange(dayValue, e.target.checked)}/>
                                </label>
                            ))}
                        </div>

                        <p>Working Schedule</p>
                        <div id='working-schedule'>
                            <label className='startTime'>
                                <input required type="time"
                                    value={startTimeString}
                                    onChange={(e)=>handleTime('startTime', e.target.value)} />
                            </label>
                            →
                            <label className='endTime'>
                                <input required type="time"
                                    value={endTimeString}
                                    onChange={(e)=>handleTime('endTime', e.target.value)} />
                            </label>
                        </div>
                      </>
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
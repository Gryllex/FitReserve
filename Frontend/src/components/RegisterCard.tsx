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

export function RegisterCard({ onRegister }: RegisterCardProps) {
    // User
    const [username, setUsername] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
    const [userRole, setUserRole] = useState<string>('USER')

    // Trainer 
    const [trainerDays, setTrainerDays] = useState<number[]>([])
    const [trainerStartTime, setTrainerStarTime] = useState<number>()
    const [trainerEndTime, setTrainerEndTime] = useState<number>()

    // Form
    const [starTimeString, setStarTimeString] =useState<string>()
    const [endTimeString, setEndTimeString] =useState<string>()
    const [showErrors, setShowErrors] = useState<boolean>(false)

    const handleRole = () => {
        const newRole = userRole === 'USER' ? 'TRAINER' : 'USER'
        setUserRole(newRole)
        console.log(newRole)
    }

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

    const handleTime = ( schedule: string, timeValue: string) => {
        const [hourStr, minuteStr] = timeValue.split(':')
        const hour = Number(hourStr)
        const minutes = Number(minuteStr)

        const time = hour*60 + minutes
        console.log(time)
        if (schedule === 'startTime') {
            setTrainerStarTime(time) 
            setStarTimeString(timeValue)
        } 
        if (schedule === 'endTime') {
            setTrainerEndTime(time)
            setEndTimeString(timeValue)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (trainerDays.length === 0) {
            setShowErrors(true)
            return
        }
        const registerUser = { name: username, email: userEmail, password: userPassword, role: 'CLIENT'}
        const registerTrainer = { name: username, email: userEmail, password: userPassword, role: 'TRAINER', daysOfWeek: trainerDays, startTime: trainerStartTime, endTime: trainerEndTime }
        onRegister( userRole === 'TRAINER' ? registerTrainer : registerUser)
    }

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
                        <input required type="text" className='register-email' placeholder='example@gmail.com'
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
                        <input required type="password" className='register-confirm-password' placeholder='**********' />
                    </div>

                    {/* Register as trainer checkbox */}
                    <div>
                        <label id='register-trainer-label'>
                            <input type="checkbox" id='register-trainer-checkbox'
                                onChange={handleRole}
                            />
                            Register as trainer</label>
                    </div>

                    {/* Trainer availability days, starTime, endTime */}
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

                        { showErrors && trainerDays.length === 0 &&
                            <div className='working-days-error'>
                                <p>At least 1 day must be selected</p>
                            </div>
                        }
                        <p>Working Schedule</p>
                        <div id='working-schedule'>
                            <label className='startTime'>
                                <input required type="time"
                                    value={starTimeString}
                                    onChange={(e)=>handleTime('startTime', e.target.value)} />
                            </label>
                            →
                            <label className='endTime'>
                                <input required type="time"
                                    value={endTimeString}
                                    onChange={(e)=>handleTime('endTime', e.target.value)} />
                            </label>
                        </div>
                      </>}

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
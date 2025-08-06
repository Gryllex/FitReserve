import { useEffect, useState } from "react"
import { RegisterTrainer } from "../RegisterTrainer"

type Schedule = {
    daysOfWeek?: number[],
    startTime?: number,
    endTime?: number
};

type fetchData = {
    id: number,
    trainerId: number,
    startTime: number,
    endTime: number,
    dayOfWeek: number[]
}

export function WorkingSchedule() {
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [newSchedule, setNewSchedule] = useState<Schedule>({});
    const [updateData, setUpdateData] = useState<boolean>(false);
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [daysOfWeekStr, setDaysOfWeekStr] = useState<string>();
    const [startTimeStr, setStartTimeStr] = useState<string>();
    const [endTimeStr, setEndTimeStr] = useState<string>();


    const hourToStr = (hourParam: number) => {
        const hour = Math.floor(hourParam)
        const minutes = Math.round((hourParam - hour) * 60)

        const hourStr = hour.toString().padStart(2, '0')
        const minutesStr = minutes.toString().padStart(2, '0')

        return `${hourStr}:${minutesStr}`
    }

    // --- EXISTING SCHEDULE ---
    useEffect(()=>{
        const fetchAvailability = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/trainer/availability', {
                    credentials: 'include'
                })

                const data = await res.json()

                if (!res.ok) throw new Error(data.error)

                const daysOfWeek = data
                    .map((entry: fetchData) => entry.dayOfWeek)
                    .sort((a: number, b: number) => {
                        if (a === 0 ) return 1;
                        if (b === 0 ) return -1;
                        return a - b
                    })
                const startTime = data[0].startTime
                const endTime = data[0].endTime

                setSchedule({
                    daysOfWeek,
                    startTime,
                    endTime
                });
                
            } catch(e) {
                console.error(e)
            }
        }

        fetchAvailability()

    },[showSuccess])

    useEffect(()=>{
        // Hours
        if (!schedule?.startTime) {
            return setStartTimeStr('Starting schedule hour not specified')
        }

        if (!schedule?.endTime ) {
            return setEndTimeStr('Ending schedule hour not specified')
        }

        const startHour = (schedule.startTime)/60;
        const endHour = (schedule.endTime)/60;

        setStartTimeStr(hourToStr(startHour))
        setEndTimeStr(hourToStr(endHour))


        // Days
        if (!schedule.daysOfWeek) { 
            return setDaysOfWeekStr('Working days not specified ')
        }

        // schedule.daysOfWeek
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const days = schedule.daysOfWeek.map(day => weekDays[day])

        setDaysOfWeekStr(days.join(', '))

    },[schedule])




    // --- NEW SCHEDULE ---
    const handleCheckbox = () => {
        setUpdateData(!updateData);
        if (updateData === false) {
            setShowErrors(false);
            setShowSuccess(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (updateData && !newSchedule?.daysOfWeek?.length) {
            setMessage('Must select at least day');
            setShowErrors(true);
            return
        }

        if (updateData && 
            (!newSchedule?.startTime || !newSchedule?.endTime || newSchedule?.startTime >= newSchedule?.endTime)) {
            setMessage('Please set a valid schedule (start must be before end)');
            setShowErrors(true);
            return
        }

        try {
            const requestData = { 
                daysOfWeek: newSchedule?.daysOfWeek, 
                startTime: newSchedule?.startTime, 
                endTime: newSchedule?.endTime
            }

            const res = await fetch('http://localhost:4000/api/trainer/availability/', {
                method: 'PUT',
                headers: { 'Content-type' : 'application/json'},
                body: JSON.stringify(requestData),
                credentials: 'include'
            });

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error)
            }

            setMessage('Schedule updated successfully');
            setShowErrors(false);
            setShowSuccess(true);

        } catch(e) {
            console.error(e);
            setMessage('Error trying to update schedule');
            setShowErrors(true);
        }
    }

    return (
        <>
            <ul className="dashboard-user-data">
                <li>
                    <h4>Current working days</h4>
                    <p> {daysOfWeekStr || 'Not specified'} </p>
                </li>

                <li>
                    <h4>Current working schedule</h4>
                    <div className="current-working-schedule">
                        <p> {startTimeStr} </p>
                        →
                        <p> {endTimeStr} </p>
                    </div>
                </li>
            </ul>

            <div className="update-working-schedule">
                <div className="update-working-schedule_checkbox-container">
                    <label>
                        <input type="checkbox" 
                            onChange={handleCheckbox}
                            hidden
                        /> 
                        <span>Change schedule</span>
                    </label>
                </div>
                { updateData && 
                    <form onSubmit={handleSubmit}>
                        <RegisterTrainer onChange={setNewSchedule} />
                        <button type="submit">Update schedule</button>    
                    </form>
                }

                { updateData && showErrors && <p className="error-message"> {message} </p>}
                { updateData && showSuccess && <p className="success-message"> {message} </p> }

            </div>
        </>
    )
}
import { useEffect, useState } from "react"

type ScheduleProps = {
    onChange: (schedule: {
        daysOfWeek: number[],
        startTime?: number,
        endTime?: number
    }) => void
}


export function RegisterTrainer({ onChange }: ScheduleProps) {
    // Trainer 
    const [trainerDays, setTrainerDays] = useState<number[]>([])
    const [trainerStartTime, setTrainerStartTime] = useState<number>()
    const [trainerEndTime, setTrainerEndTime] = useState<number>()

    // Form
    const [startTimeString, setStartTimeString] =useState<string>('')
    const [endTimeString, setEndTimeString] =useState<string>('')


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


    useEffect(()=>{
        onChange({
            daysOfWeek: trainerDays.sort((a, b) => a - b),
            startTime: trainerStartTime,
            endTime: trainerEndTime
        })
    },[trainerDays, trainerStartTime, trainerEndTime])


    return (
        // Trainer availability days, startTime, endTime
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
    )
}

export const hourToStr = (hourParam: number) => {
        const hour = Math.floor(hourParam)
        const minutes = Math.round((hourParam - hour) * 60)

        const hourStr = hour.toString().padStart(2, '0')
        const minutesStr = minutes.toString().padStart(2, '0')

        return `${hourStr}:${minutesStr}`
    }

export const formatDate = (isoDateStr: string) => {
    const date = new Date(isoDateStr);

    const day = date.getDate().toString().padStart(2,'0');
    const month = (date.getMonth() +1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2,'0')
    const minutes = date.getMinutes().toString().padStart(2,'0')

    return `${day}/${month}/${year} - ${hours}:${minutes}`
}

export const durationToStr = (durationParam: number) => {
    const hour = durationParam/60
    const [hourStr, minutesStr] = hourToStr(hour).split(':')

        return `${hourStr}H ${minutesStr}M`
}

export const capitalizeFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
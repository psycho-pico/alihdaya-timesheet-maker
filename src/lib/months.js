const months = [
    {id: 0, name: 'Januari'},
    {id: 1, name: 'Februari'},
    {id: 2, name: 'Maret'},
    {id: 3, name: 'April'},
    {id: 4, name: 'Mei'},
    {id: 5, name: 'Juni'},
    {id: 6, name: 'Juli'},
    {id: 7, name: 'Agustus'},
    {id: 8, name: 'September'},
    {id: 9, name: 'Oktober'},
    {id: 10, name: 'November'},
    {id: 11, name: 'Desember'},
]

const untilToday = month => {
    const d = new Date();
    const thisMonth = d.getMonth();
    return month.id <= thisMonth;
};

export const getAllMonths = () => months;

export const getThisMonth = () => {
    const d = new Date();
    return months[d.getMonth()];
};

export const getMonthsUntilToday = month => {
    const allMonths = getAllMonths();
    return allMonths.filter(untilToday);
};

export const getMonthById = id => {
    const d = new Date();
    return months[id];
};

export const getAllDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

export const getFormattedTimesheetDate = day => {
    const formattedDate = String(day?.getDate()).padStart(2, '0');
    const formattedMonth = String(day?.getMonth() + 1).padStart(2, '0');
    const formattedYear = day?.getFullYear();
    return `${formattedDate}/${formattedMonth}/${formattedYear}`;
};

export const dateIsWeekend = date => (date?.getDay() === 6) || (date?.getDay() === 0);
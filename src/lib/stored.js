import {createSlice} from '@reduxjs/toolkit'

const LOCAL_STORAGE_STORED = 'ALIHDAYA_TIMESHEET_MAKER.STORED';


function getLocalStorage() {
    let localStorages = '{}';
    if (typeof window !== 'undefined') {
        localStorages = localStorage.getItem(LOCAL_STORAGE_STORED);
    }
    return JSON.parse(localStorages);
}

const updateStoredLocalStorage = (value) => {
    localStorage.setItem(LOCAL_STORAGE_STORED, JSON.stringify(value));
}

const defaultValueYearMonth = () => {
    const localStorages = getLocalStorage();
    return localStorages?.yearMonth || [];
}

const defaultValueVariables = () => {
    const defaultValues = {
        full_name: "",
        job_position: "",
        kepala_divisi: "Alfian Noor",
        reporting_manager: "Epafras E. Christian",
        work_unit: "Digital Service Squad (Syariah)",
        working_company: "PT Pegadaian"
    }
    const localStorages = getLocalStorage();
    return localStorages?.variablesData || defaultValues;
}

const sortYearMonth = (yearMonth) => yearMonth.sort((a, b) => a.id - b.id);

export const selectedSlice = createSlice({
    name: 'stored',
    initialState: {
        value: {
            yearMonth: defaultValueYearMonth(),
            variablesData: defaultValueVariables(),
            message: {}
        },
    },
    reducers: {
        save: (state, action) => {
            const keys = Object.keys(action.payload);
            keys.forEach((key, index) => {
                switch (key) {
                    case 'yearMonth':
                        state.value.yearMonth = addStoredYearMonth(action.payload[key], state);
                        break;
                    case 'variablesData':
                        state.value.variablesData = addStoredVariablesData(action.payload[key], state);
                        break;
                    default:
                        state.value[key] = action.payload[key];
                }
            });
            updateStoredLocalStorage(state.value);
        },
        remove: (state, action) => {
            const keys = Object.keys(action.payload);
            keys.forEach((key, index) => {
                switch (key) {
                    case 'yearMonth':
                        state.value.yearMonth = removeStoredYearMonth(action.payload[key], state);
                        break;
                    case 'message':
                        state.value.message = {};
                        break;
                    default:
                        state.value[key] = action.payload[key];
                }
            });
            updateStoredLocalStorage(state.value);
        },
        removeStoredMessage: (state) => {
            state.value.message = {}
        }
    },
});

const findYear = (o, yearMonth) => o.year?.toString() === yearMonth.year?.toString();

const findMonth = (o, yearMonth) => o.id?.toString() === yearMonth.month?.id?.toString();

const addStoredYearMonth = (yearMonth, state) => {
    let existingYearMonths = defaultValueYearMonth();
    if (yearMonth.year === null || yearMonth.month === null || yearMonth.year === undefined || yearMonth.month === undefined) {
        return existingYearMonths;
    }
    if (existingYearMonths.find(o => findYear(o, yearMonth))?.months?.find(o => findMonth(o, yearMonth))) {
        state.value.message = {
            type: "info",
            description: "Month already exist."
        };
        return existingYearMonths;
    }
    if (!existingYearMonths.find(o => findYear(o, yearMonth))) {
        existingYearMonths = [...existingYearMonths, {year: yearMonth.year, months: []}];
    }
    if (!existingYearMonths.find(o => findYear(o, yearMonth))?.months?.find(o => findMonth(o, yearMonth))) {
        const indexOfYear = existingYearMonths.findIndex(o => findYear(o, yearMonth));
        existingYearMonths[indexOfYear].months = [...existingYearMonths[indexOfYear].months, yearMonth.month];
        sortYearMonth(existingYearMonths[indexOfYear].months);
    }
    state.value.message = {
        type: "success",
        description: "Month added successfully."
    };
    return existingYearMonths;
}

const addStoredVariablesData = (variablesData, state) => {
    state.value.message = {
        type: "success",
        description: "Variables updated successfully."
    };
    return variablesData;
}

export const {save, remove, removeStoredMessage} = selectedSlice.actions;
export {defaultValueYearMonth};
export default selectedSlice.reducer;
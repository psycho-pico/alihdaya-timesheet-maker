import {createSlice} from '@reduxjs/toolkit'

const LOCAL_STORAGE_SELECTED = 'ALIHDAYA_TIMESHEET_MAKER.SELECTED';


export const thisYear = () => {
    const d = new Date();
    return d.getFullYear();
}

const thisMonth = () => {
    const d = new Date();
    return d.getMonth();
}

const getLocalStorage = () => {
    let localStorages = '{}';
    if (typeof window !== 'undefined') {
        localStorages = localStorage.getItem(LOCAL_STORAGE_SELECTED);
    }
    return JSON.parse(localStorages);
};

const updateSelectedLocalStorage = (value) => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED, JSON.stringify(value));
}

const defaultValueYear = () => {
    const localStorages = getLocalStorage();
    return localStorages?.year || thisYear().toString();
}

const defaultValueTheme = () => {
    const localStorages = getLocalStorage();
    return localStorages?.theme || 'dark';
}

export const selectedSlice = createSlice({
    name: 'selected',
    initialState: {
        value: {
            year: defaultValueYear(),
            themes: ["light", "dark"],
            theme: defaultValueTheme()
        },
    },
    reducers: {
        save: (state, action) => {
            const keys = Object.keys(action.payload);
            keys.forEach((key, index) => {
                state.value[key] = action.payload[key];
            });
            updateSelectedLocalStorage(state.value);
        }
    },
});

export const {save} = selectedSlice.actions;
export {defaultValueYear};
export default selectedSlice.reducer;
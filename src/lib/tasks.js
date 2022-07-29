import {createSlice} from '@reduxjs/toolkit'
import {selectedTypes} from "../components/Dialog.Select.TaskType";

const LOCAL_STORAGE_TASKS = 'ALIHDAYA_TIMESHEET_MAKER.TASKS';


function getLocalStorage(yearMonth) {
    let localStorages = '[]';
    if (typeof window !== 'undefined') {
        localStorages = localStorage.getItem(`${LOCAL_STORAGE_TASKS}_${yearMonth}`) || '[]';
    }
    return JSON.parse(localStorages);
}

const updateSelectedLocalStorage = (value, year, month) => {
    localStorage.setItem(`${LOCAL_STORAGE_TASKS}_${year}_${month}`, JSON.stringify(value));
}

const defaultValueTask = (selectedYear, selectedMonth) => {
    return getLocalStorage(`${selectedYear}_${selectedMonth}`);
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        value: {
            dates: [],
            message: {}
        },
    },
    reducers: {
        save: (state, action) => {
            const date = action.payload.date || null;
            const month = action.payload.month || null;
            const year = action.payload.year || null;
            const todo = action.payload.todo || null;
            const type = action.payload.type || null;
            const indexData = action.payload.indexData;
            const initialDate = action.payload.initialDate || null;
            const initialType = action.payload.initialType || null;
            if (!date || !month || !year || !type || !todo) {
                console.log('date', date);
                console.log('month', month);
                console.log('year', year);
                console.log('type', type);
                console.log('todo', todo);
                state.value.message = {
                    type: "warning",
                    description: "Something went wrong."
                };
                return;
            }
            const stateValueDates = defaultValueTask(year, month) || [];
            const stateValueDatesLength = stateValueDates?.length || 0;
            let stateValueInitialDate = stateValueDates?.find((object) => object.date === initialDate) || [];
            if (indexData !== null && indexData !== -1) {
                if (!initialDate || !initialType) {
                    state.value.message = {
                        type: "warning",
                        description: "Something went wrong."
                    };
                    return;
                }
                stateValueInitialDate[initialType.toLowerCase()].splice(indexData, 1);
                const indexOfInitialDate = stateValueDates?.findIndex((object) => object.date === initialDate) || 0;
                if (indexOfInitialDate !== -1) {
                    stateValueDates[indexOfInitialDate] = stateValueInitialDate;
                }
            }
            let stateValueCurrentDate = stateValueDates?.find((object) => object.date === date) || [];
            if (stateValueCurrentDate.length === 0) {
                stateValueCurrentDate = {
                    date: date,
                    task: [],
                    overtime: [],
                }
            }
            stateValueCurrentDate[type.toLowerCase()] = [...stateValueCurrentDate[type.toLowerCase()], todo];
            const indexOfCurrentDate = stateValueDates?.findIndex((object) => object.date === date) || 0;
            stateValueDates[indexOfCurrentDate !== -1 ? indexOfCurrentDate : stateValueDatesLength] = stateValueCurrentDate;

            state.value.dates = stateValueDates;
            updateSelectedLocalStorage(state.value.dates, year, month);

            state.value.message = {
                type: "success",
                description: `${type || selectedTypes.TASK} ${indexData === -1 ? 'added' : 'updated'} successfully.`
            };
        },
        remove: (state, action) => {
            const month = action.payload.month || null;
            const year = action.payload.year || null;
            const initialType = action.payload.initialType || null;
            const indexData = action.payload.indexData;
            const initialDate = action.payload.initialDate || null;
            if (!initialDate || !month || !year || !initialType || indexData === null || indexData === -1) {
                state.value.message = {
                    type: "warning",
                    description: "Something went wrong."
                };
                return;
            }
            const stateValueDates = defaultValueTask(year, month) || [];
            let stateValueInitialDate = stateValueDates?.find((object) => object.date === initialDate) || [];
            stateValueInitialDate[initialType.toLowerCase()].splice(indexData, 1);
            const indexOfDate = stateValueDates?.findIndex((object) => object.date === initialDate) || 0;
            stateValueDates[indexOfDate] = stateValueInitialDate;

            state.value.dates = stateValueDates;
            updateSelectedLocalStorage(state.value.dates, year, month);

            state.value.message = {
                type: "success",
                description: (initialType || selectedTypes.TASK) + " deleted successfully."
            };
        },
        initMonthYearTask: (state, action) => {
            state.value.dates = defaultValueTask(action.payload.year, action.payload.month);
        },
        removeTasksMessage: (state) => {
            state.value.message = {}
        }
    },
});

export const {save, initMonthYearTask, removeTasksMessage, remove} = tasksSlice.actions;
export default tasksSlice.reducer;
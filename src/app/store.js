import {configureStore} from '@reduxjs/toolkit';
import selectedReducer from '../lib/selected';
import storedReducer from '../lib/stored';
import tasksReducer from '../lib/tasks';


const reducer = {
    selected: selectedReducer,
    stored: storedReducer,
    tasks: tasksReducer,
};
const middleware = (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk);

export default configureStore({
    reducer
});
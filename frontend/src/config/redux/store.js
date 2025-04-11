/*
    **Steps for state management
    1.submit action
    2.handle action in it's reducer
    3.register here-> reducer
*/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
export const store=configureStore({
    reducer:{
        auth:authReducer,
        posts:postReducer
    }
});

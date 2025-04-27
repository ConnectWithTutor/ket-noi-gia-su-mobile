import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
// import classReducer from './classSlice';
// import scheduleReducer from './scheduleSlice';
// import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // class: classReducer,
    // schedule: scheduleReducer,
    // message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  role: 'student' | 'tutor' | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role as 'student' | 'tutor';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

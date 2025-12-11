import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Session = { token: string; userId?: string; expiresAt?: string };
type SessionState = { session: Session | null };

const initialState: SessionState = { session: null };

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload;
    },
    clearSession: (state) => {
      state.session = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;

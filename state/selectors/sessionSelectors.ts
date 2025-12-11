// store/selectors.ts
import { RootState } from '../index';

export const selectSession = (state: RootState) => state.session.session;
export const selectIsAuthenticated = (state: RootState) => !!state.session.session;

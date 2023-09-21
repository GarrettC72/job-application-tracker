import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch } from '../../app/store';

interface NotificationState {
  message: string | null;
  type?: 'success' | 'error';
}

const initialState: NotificationState = {
  message: null,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set(_state, action: PayloadAction<NotificationState>) {
      return action.payload;
    },
    clear() {
      return initialState;
    },
  },
});

export const { set, clear } = notificationSlice.actions;

export const setNotification = (message: string, type: 'success' | 'error') => {
  return async (dispatch: AppDispatch) => {
    dispatch(set({ message, type }));
    setTimeout(() => {
      dispatch(clear());
    }, 3000);
  };
};

export default notificationSlice.reducer;

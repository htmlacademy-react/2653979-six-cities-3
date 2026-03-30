import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { clearErrorAction } from '../api-actions';

type AppError = {
  error: string | null;
}

const initialState: AppError = {
  error: null,
};

export const appError = createSlice({
  name: NameSpace.Error,
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearErrorAction.fulfilled, (state) => {
        state.error = null;
      });
  }
});

export const { setError } = appError.actions;

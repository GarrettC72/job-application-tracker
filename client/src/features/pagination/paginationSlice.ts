import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PaginationState {
  page: number;
  rowsPerPage: number;
  filter: string;
}

const initialState: PaginationState = {
  page: 0,
  rowsPerPage: 10,
  filter: "",
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.page = 0;
    },
    clearFilter(state) {
      state.filter = "";
      state.page = 0;
    },
  },
});

export const { setPage, setRowsPerPage, setFilter, clearFilter } =
  paginationSlice.actions;

export default paginationSlice.reducer;

import { TextField } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setFilter } from "./paginationSlice";

const Filter = () => {
  const { filter } = useAppSelector(({ pagination }) => pagination);
  const dispatch = useAppDispatch();

  return (
    <TextField
      value={filter}
      onChange={({ target }) => dispatch(setFilter(target.value))}
      placeholder="Search by company name"
      fullWidth
      sx={{ my: 2 }}
    />
  );
};

export default Filter;

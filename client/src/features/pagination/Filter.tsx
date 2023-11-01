import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Clear } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearFilter, setFilter } from "./paginationSlice";

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
      InputProps={{
        endAdornment:
          filter === "" ? null : (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={() => dispatch(clearFilter())}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
      }}
    />
  );
};

export default Filter;

import { TablePagination } from "@mui/material";

import { useJobsQuery } from "../../hooks";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPage, setRowsPerPage } from "./paginationSlice";

const Pagination = () => {
  const { page, rowsPerPage } = useAppSelector(({ pagination }) => pagination);
  const { count } = useJobsQuery();
  const dispatch = useAppDispatch();

  return (
    <TablePagination
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(_event, page) => dispatch(setPage(page))}
      onRowsPerPageChange={(event) =>
        dispatch(setRowsPerPage(+event.target.value))
      }
    />
  );
};

export default Pagination;

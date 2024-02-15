import { TablePagination } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPage, setRowsPerPage } from "./paginationSlice";

interface Props {
  count: number;
}

const Pagination = ({ count }: Props) => {
  const page = useAppSelector(({ pagination }) => pagination.page);
  const rowsPerPage = useAppSelector(
    ({ pagination }) => pagination.rowsPerPage
  );
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

import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  Typography,
} from "@mui/material";
import { AddBox, DeleteForever, Edit } from "@mui/icons-material";

import { removeJobFromCache } from "../../utils/cache";
import { useJobsQuery, useNotification } from "../../hooks";
import { SimpleJob } from "../../types";
import { DELETE_JOB } from "../../graphql/mutations";
import Pagination from "../../features/pagination/Pagination";
import Filter from "../../features/pagination/Filter";
import DeleteJobDialog from "./DeleteJobDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.hover,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const JobListPage = () => {
  const [selectedJob, setSelectedJob] = useState<SimpleJob | null>(null);

  const notifyWith = useNotification();

  const { jobsToDisplay, loading } = useJobsQuery();
  const [deleteJob] = useMutation(DELETE_JOB, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.deleteJob;
      if (job) {
        notifyWith(
          `Job '${job.jobTitle} at ${job.companyName}' successfully deleted`,
          "success"
        );
      }
    },
    update: (cache, result) => {
      const deletedJob = result.data ? result.data.deleteJob : null;
      if (deletedJob) {
        removeJobFromCache(cache, deletedJob.id);
      }
    },
  });

  if (loading) {
    return (
      <Typography variant="body1" align="center">
        Loading...
      </Typography>
    );
  }

  const handleDelete = (job: SimpleJob | null) => {
    if (job) {
      deleteJob({ variables: { id: job.id } });
    }
    setSelectedJob(null);
  };

  const jobsTableBody = () => {
    return (
      <TableBody>
        {jobsToDisplay.map((job) => (
          <StyledTableRow key={job.id}>
            <StyledTableCell>{job.companyName}</StyledTableCell>
            <StyledTableCell>{job.jobTitle}</StyledTableCell>
            <StyledTableCell>{job.latestActivity}</StyledTableCell>
            <StyledTableCell>{job.dateCreated}</StyledTableCell>
            <StyledTableCell>{job.lastModified}</StyledTableCell>
            <StyledTableCell>
              <Button
                component={Link}
                to={`/jobs/${job.id}`}
                variant="contained"
                startIcon={<Edit />}
              >
                Edit
              </Button>{" "}
              |{" "}
              <Button
                onClick={() => setSelectedJob(job)}
                variant="contained"
                startIcon={<DeleteForever />}
              >
                Delete
              </Button>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Your Jobs
      </Typography>
      <Button
        component={Link}
        to="/create"
        variant="contained"
        startIcon={<AddBox />}
      >
        Add New Job
      </Button>
      <Filter />
      <Paper sx={{ width: "100%" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Company Name</StyledTableCell>
                <StyledTableCell>Job Title</StyledTableCell>
                <StyledTableCell>Latest Activity</StyledTableCell>
                <StyledTableCell>Date Created</StyledTableCell>
                <StyledTableCell>Last Modified</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {jobsTableBody()}
          </Table>
        </TableContainer>
        <Pagination />
      </Paper>
      <DeleteJobDialog
        open={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
        onConfirm={() => handleDelete(selectedJob)}
        dialogText={
          selectedJob
            ? `Delete job '${selectedJob.jobTitle} at ${selectedJob.companyName}'?`
            : ""
        }
      />
    </div>
  );
};

export default JobListPage;

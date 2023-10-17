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

import { USER_JOBS } from "../../graphql/queries";
import { DELETE_JOB } from "../../graphql/mutations";
import { SimpleJob } from "../../types";
import { useJobsQuery, useNotification } from "../../hooks";
import Pagination from "../../features/pagination/Pagination";
import DeleteJobDialog from "./DeleteJobDialog";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "lightgray",
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

  const { currentJobs, loading } = useJobsQuery();
  const [deleteJob] = useMutation(DELETE_JOB, {
    refetchQueries: [{ query: USER_JOBS }],
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
  });

  if (loading) {
    return <div>loading...</div>;
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
        {currentJobs.map((job) => (
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
              >
                Edit
              </Button>{" "}
              |{" "}
              <Button onClick={() => setSelectedJob(job)} variant="contained">
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
        sx={{ marginBottom: "1em" }}
      >
        Add New Job
      </Button>
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

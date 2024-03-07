import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";

import { SimpleJob } from "../../types";
import { useAppSelector } from "../../app/hooks";
import { filterJobs, getJobsPage } from "../../utils/jobs";
import { removeJobFromCache } from "../../utils/cache";
import { DELETE_JOB } from "../../graphql/mutations";
import useJobs from "../../hooks/useJobs";
import useNotification from "../../hooks/useNotification";
import Pagination from "../../features/pagination/Pagination";
import Loading from "../Loading";
import DeleteJobDialog from "./DeleteJobDialog";
import ServerResponse from "../ServerResponse";

interface JobsTableContainerProps {
  jobs: SimpleJob[];
  count: number;
  setSelectedJob: Dispatch<SetStateAction<SimpleJob | null>>;
}

interface JobsTableRowProps {
  job: SimpleJob;
  onClick: () => void;
}

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

const JobsTableRow = ({ job, onClick }: JobsTableRowProps) => {
  return (
    <StyledTableRow>
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
          onClick={onClick}
          variant="contained"
          startIcon={<DeleteForever />}
        >
          Delete
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  );
};

const JobsTableContainer = ({
  jobs,
  count,
  setSelectedJob,
}: JobsTableContainerProps) => {
  return (
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
          <TableBody>
            {jobs.map((job) => (
              <JobsTableRow
                job={job}
                onClick={() => setSelectedJob(job)}
                key={job.id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={count} />
    </Paper>
  );
};

const JobsTable = () => {
  const [selectedJob, setSelectedJob] = useState<SimpleJob | null>(null);
  const { jobs, loading, error } = useJobs();
  const { page, rowsPerPage, filter } = useAppSelector(
    ({ pagination }) => pagination
  );

  const notifyWith = useNotification();

  const [deleteJob, { loading: deleteLoading }] = useMutation(DELETE_JOB, {
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

  const filteredJobs = useMemo(
    () => (jobs ? filterJobs(jobs, filter) : []),
    [jobs, filter]
  );
  const jobsToDisplay = useMemo(
    () => getJobsPage(filteredJobs, page, rowsPerPage),
    [filteredJobs, page, rowsPerPage]
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ServerResponse
        title="Server Issues"
        message="There is currently an issue with the server."
        callToAction="Please try again later."
      />
    );
  }

  const count = filteredJobs.length;

  const handleDelete = (job: SimpleJob | null) => {
    if (job) {
      deleteJob({ variables: { id: job.id } });
    }
    setSelectedJob(null);
  };

  return (
    <>
      <JobsTableContainer
        jobs={jobsToDisplay}
        count={count}
        setSelectedJob={setSelectedJob}
      />
      <DeleteJobDialog
        open={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
        onConfirm={() => handleDelete(selectedJob)}
        dialogText={
          selectedJob
            ? `Delete job '${selectedJob.jobTitle} at ${selectedJob.companyName}'?`
            : ""
        }
        disabled={deleteLoading}
      />
    </>
  );
};

export default JobsTable;

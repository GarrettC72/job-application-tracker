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
import { useMemo, useState } from "react";

import { SimpleJob } from "../../types";
import { useAppSelector } from "../../app/hooks";
import { filterJobs, getJobsPage } from "../../utils/jobs";
import useJobs from "../../hooks/useJobs";
import Pagination from "../../features/pagination/Pagination";
import Loading from "../Loading";
import DeleteJobDialog from "./DeleteJobDialog";
import ServerResponse from "../ServerResponse";

interface JobsTableContainerProps {
  jobs: SimpleJob[];
  count: number;
  setSelectedJob: React.Dispatch<React.SetStateAction<SimpleJob | null>>;
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
    return <ServerResponse />;
  }

  const count = filteredJobs.length;

  return (
    <>
      <JobsTableContainer
        jobs={jobsToDisplay}
        count={count}
        setSelectedJob={setSelectedJob}
      />
      <DeleteJobDialog job={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
};

export default JobsTable;

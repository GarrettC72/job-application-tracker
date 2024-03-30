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

import {
  FragmentType,
  getFragmentData,
} from "../../__generated__/fragment-masking";
import { JOB_DETAILS } from "../../graphql/fragments";
import { useAppSelector } from "../../app/hooks";
import { filterJobs } from "../../utils/jobs";
import { convertDate } from "../../utils/parser";
import { ActivityType } from "../../types";
import useJobs from "../../hooks/useJobs";
import Pagination from "../../features/pagination/Pagination";
import Loading from "../Loading";
import DeleteJobDialog from "./DeleteJobDialog";
import ServerResponse from "../ServerResponse";

interface JobsTableContainerProps {
  jobs: Array<FragmentType<typeof JOB_DETAILS>>;
  count: number;
  setSelectedJob: React.Dispatch<
    React.SetStateAction<FragmentType<typeof JOB_DETAILS> | null>
  >;
}

interface JobsTableRowProps {
  job: FragmentType<typeof JOB_DETAILS>;
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
  const jobFragment = getFragmentData(JOB_DETAILS, job);
  return (
    <StyledTableRow>
      <StyledTableCell>{jobFragment.companyName}</StyledTableCell>
      <StyledTableCell>{jobFragment.jobTitle}</StyledTableCell>
      <StyledTableCell>
        {jobFragment.latestActivity
          ? ActivityType[jobFragment.latestActivity]
          : ""}
      </StyledTableCell>
      <StyledTableCell>{convertDate(jobFragment.dateCreated)}</StyledTableCell>
      <StyledTableCell>{convertDate(jobFragment.lastModified)}</StyledTableCell>
      <StyledTableCell>
        <Button
          component={Link}
          to={`/jobs/${jobFragment.id}`}
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
                key={getFragmentData(JOB_DETAILS, job).id}
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
  const [selectedJob, setSelectedJob] = useState<FragmentType<
    typeof JOB_DETAILS
  > | null>(null);
  const { jobs, loading, error } = useJobs();
  const { page, rowsPerPage, filter } = useAppSelector(
    ({ pagination }) => pagination
  );

  const filteredJobs = useMemo(
    () => (jobs ? filterJobs(jobs, filter) : []),
    [jobs, filter]
  );
  const jobsToDisplay = useMemo(
    () => filteredJobs.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
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

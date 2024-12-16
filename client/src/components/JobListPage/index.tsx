import { Button, Typography } from "@mui/material";
import { AddBox } from "@mui/icons-material";
import { Link } from "react-router";

import Filter from "../../features/pagination/Filter";
import JobsTable from "./JobsTable";

const JobListPage = () => {
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
      <JobsTable />
    </div>
  );
};

export default JobListPage;

import { Typography } from "@mui/material";

import AddJobForm from "./AddJobForm";

const AddJobPage = () => {
  console.log("Create");
  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Add A New Job
      </Typography>
      <AddJobForm />
    </div>
  );
};

export default AddJobPage;

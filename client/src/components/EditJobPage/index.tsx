import { Typography } from "@mui/material";

import EditJobForm from "./EditJobForm";

const EditJobPage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Edit Job
      </Typography>
      <EditJobForm />
    </div>
  );
};

export default EditJobPage;

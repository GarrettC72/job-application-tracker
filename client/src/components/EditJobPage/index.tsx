import { Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import EditJobForm from "./EditJobForm";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";
import useJob from "../../hooks/useJob";

const EditJobPage = () => {
  const jobId = useParams().id ?? "";
  const { job, loading, error } = useJob(jobId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    const graphqlError = error.graphQLErrors[0];
    if (
      graphqlError.extensions.code &&
      typeof graphqlError.extensions.code === "string"
    ) {
      const errorCode = graphqlError.extensions.code;
      if (errorCode === "JOB_NOT_FOUND") {
        return (
          <ServerResponse
            title="Job Not Found"
            message="We could not find the job you're looking for."
            callToAction={<Link to="/">Go to the Home Page</Link>}
          />
        );
      }
      if (errorCode === "NOT_PERMITTED") {
        return (
          <ServerResponse
            title="Access Forbidden"
            message="You do not have permission to view this job."
            callToAction={<Link to="/">Go to the Home Page</Link>}
          />
        );
      }
    }
    return <ServerResponse />;
  }

  if (!job) {
    return <ServerResponse />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Edit Job
      </Typography>
      <EditJobForm jobFragment={job} />
    </div>
  );
};

export default EditJobPage;

import { Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import { addJobToCache } from "../../utils/cache";
import { JobFormFields } from "../../types";
import { CREATE_JOB } from "../../graphql/mutations";
import useNotification from "../../hooks/useNotification";
import JobForm from "../JobForm";

const AddJobPage = () => {
  const notifyWith = useNotification();
  const navigate = useNavigate();

  const [createJob, { loading }] = useMutation(CREATE_JOB, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.addJob;
      if (job) {
        notifyWith(
          `New job '${job.jobTitle} at ${job.companyName}' successfully saved`,
          "success"
        );
        navigate("/");
      }
    },
    update: (cache, result) => {
      const addedJob = result.data ? result.data.addJob : null;
      if (addedJob) {
        addJobToCache(cache, addedJob);
      }
    },
  });

  const onSubmit = (data: JobFormFields) => {
    createJob({ variables: { jobParams: data } });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Add A New Job
      </Typography>
      <JobForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
};

export default AddJobPage;

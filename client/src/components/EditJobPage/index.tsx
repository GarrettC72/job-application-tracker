import { Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getFragmentData } from "../../__generated__/fragment-masking";
import { UPDATE_JOB } from "../../graphql/mutations";
import { FULL_JOB_DETAILS } from "../../graphql/fragments";
import { JobFormFields } from "../../types";
import useJob from "../../hooks/useJob";
import useNotification from "../../hooks/useNotification";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";
import JobForm from "../JobForm";

const EditJobPage = () => {
  const jobId = useParams().id ?? "";
  const { job, loading: queryLoading, error } = useJob(jobId);
  const notifyWith = useNotification();
  const navigate = useNavigate();

  const [updateJob, { loading: mutationLoading }] = useMutation(UPDATE_JOB, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.updateJob;
      if (job) {
        const unmaskedJob = getFragmentData(FULL_JOB_DETAILS, job);
        notifyWith(
          `Job '${unmaskedJob.jobTitle} at ${unmaskedJob.companyName}' successfully updated`,
          "success"
        );
        navigate("/");
      }
    },
  });

  if (queryLoading) {
    return <Loading />;
  }

  if (error) {
    const graphqlError = error.graphQLErrors[0];
    if (
      graphqlError.extensions &&
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

  const { id, ...jobFields } = getFragmentData(FULL_JOB_DETAILS, job);

  const onSubmit = (data: JobFormFields) => {
    updateJob({ variables: { id: id, jobParams: data } });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Edit Job
      </Typography>
      <JobForm
        key={id}
        initalJobState={jobFields}
        onSubmit={onSubmit}
        loading={mutationLoading}
      />
    </div>
  );
};

export default EditJobPage;

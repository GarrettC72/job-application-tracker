import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

import { DELETE_JOB, USER_JOBS } from "../../queries";
import { SimpleJob } from "../../types";
import { useNotification } from "../../hooks";

const JobListPage = () => {
  const jobs = useQuery(USER_JOBS);

  const notifyWith = useNotification();
  const navigate = useNavigate();

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

  if (jobs.loading) {
    return <div>loading...</div>;
  }

  const removeJob = (job: SimpleJob) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${job.jobTitle} at ${job.companyName}?`
      )
    ) {
      console.log(job);
      deleteJob({ variables: { id: job.id } });
    }
  };

  const jobsTable = () => {
    if (!jobs.data || !jobs.data.allJobs) {
      return <div>No jobs found</div>;
    }

    return (
      <table>
        <tbody>
          <tr>
            <th>Company Name</th>
            <th>Job Title</th>
            <th>Latest Activity</th>
            <th>Date Created</th>
            <th>Last Modified</th>
            <th>Action</th>
          </tr>
          {jobs.data.allJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.companyName}</td>
              <td>{job.jobTitle}</td>
              <td>{job.latestActivity}</td>
              <td>{job.dateCreated}</td>
              <td>{job.lastModified}</td>
              <td>
                <Link to={`/jobs/${job.id}`}>Edit</Link> |{" "}
                <button onClick={() => removeJob(job)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Jobs</h2>
      <button onClick={() => navigate("/create")}>Add New Job</button>
      {jobsTable()}
    </div>
  );
};

export default JobListPage;

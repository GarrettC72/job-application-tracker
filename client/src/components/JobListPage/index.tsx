import { useQuery } from "@apollo/client";

import { USER_JOBS } from "../../queries";
import { Link } from "react-router-dom";

const JobListPage = () => {
  const jobs = useQuery(USER_JOBS);

  if (jobs.loading) {
    return <div>loading...</div>;
  }

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
                <Link to={`/jobs/${job.id}`}>Edit</Link> | Delete
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
      {jobsTable()}
    </div>
  );
};

export default JobListPage;

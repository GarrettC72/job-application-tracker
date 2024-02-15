import {
  FragmentType,
  getFragmentData,
} from "../__generated__/fragment-masking";
import { JOB_DETAILS } from "../graphql/fragments";
import { convertDate } from "./parser";

export const filterJobs = (
  jobs: Array<FragmentType<typeof JOB_DETAILS>>,
  filter: string
) => {
  return jobs.filter((job) => {
    const unmaskedJob = getFragmentData(JOB_DETAILS, job);
    return unmaskedJob.companyName.toLowerCase().includes(filter.toLowerCase());
  });
};

export const getJobsPage = (
  jobs: Array<FragmentType<typeof JOB_DETAILS>>,
  page: number,
  rowsPerPage: number
) => {
  return jobs.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((job) => {
    const unmaskedJob = getFragmentData(JOB_DETAILS, job);
    return {
      ...unmaskedJob,
      dateCreated: convertDate(unmaskedJob.dateCreated),
      lastModified: convertDate(unmaskedJob.lastModified),
    };
  });
};

import {
  FragmentType,
  getFragmentData,
} from "../__generated__/fragment-masking";
import { JOB_DETAILS } from "../graphql/fragments";

export const filterJobs = (
  jobs: Array<FragmentType<typeof JOB_DETAILS>>,
  filter: string
) => {
  return jobs.filter((job) => {
    const unmaskedJob = getFragmentData(JOB_DETAILS, job);
    return unmaskedJob.companyName.toLowerCase().includes(filter.toLowerCase());
  });
};

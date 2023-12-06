import { ApolloCache } from "@apollo/client";

import { getFragmentData } from "../__generated__";
import { JobDetailsFragment } from "../__generated__/graphql";
import { USER_JOBS } from "../graphql/queries";
import { JOB_DETAILS } from "../graphql/fragments";

export const addJobToCache = (
  cache: ApolloCache<object>,
  addedJob: JobDetailsFragment
) => {
  const uniqById = (jobs: JobDetailsFragment[]) => {
    const seen = new Set();
    return jobs.filter((job) => {
      const id = job.id;
      return seen.has(id) ? false : seen.add(id);
    });
  };

  cache.updateQuery({ query: USER_JOBS }, (data) => {
    if (data) {
      const updatedJobs = data.allJobs.slice();
      updatedJobs.unshift(addedJob);
      const uniqueJobs = uniqById(
        updatedJobs.map((job) => getFragmentData(JOB_DETAILS, job))
      );
      return {
        allJobs: uniqueJobs,
      };
    }
  });
};

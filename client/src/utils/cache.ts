import { ApolloCache } from "@apollo/client";

import {
  FragmentType,
  getFragmentData,
} from "../__generated__/fragment-masking";
import { USER_JOBS } from "../graphql/queries";
import { JOB_DETAILS } from "../graphql/fragments";

export const addJobToCache = (
  cache: ApolloCache<object>,
  addedJob: FragmentType<typeof JOB_DETAILS>
) => {
  const uniqById = (jobs: Array<FragmentType<typeof JOB_DETAILS>>) => {
    const seen = new Set();
    return jobs.filter((job) => {
      const jobFragment = getFragmentData(JOB_DETAILS, job);
      const id = jobFragment.id;
      return seen.has(id) ? false : seen.add(id);
    });
  };
  const jobFragment = getFragmentData(JOB_DETAILS, addedJob);

  cache.updateQuery({ query: USER_JOBS }, (data) => {
    if (data) {
      const updatedJobs = data.allJobs.slice();
      updatedJobs.unshift(addedJob);
      const uniqueJobs = uniqById(updatedJobs);
      return {
        allJobs: uniqueJobs,
      };
    }
  });

  const id = cache.identify({ __typename: "Job", id: jobFragment.id });
  cache.evict({ id, fieldName: "user" });
};

export const removeJobFromCache = (cache: ApolloCache<object>, id: string) => {
  const cacheId = cache.identify({ __typename: "Job", id });
  cache.evict({ id: cacheId });
  cache.gc();
};

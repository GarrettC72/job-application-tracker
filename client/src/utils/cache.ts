import { ApolloCache } from "@apollo/client";

import { JobDetailsFragment } from "../__generated__/graphql";
import { GET_USER_JOBS } from "../graphql/queries";

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

  cache.updateQuery({ query: GET_USER_JOBS }, (data) => {
    if (data) {
      const updatedJobs = data.allJobs.slice();
      updatedJobs.unshift(addedJob);
      const uniqueJobs = uniqById(updatedJobs);
      return {
        allJobs: uniqueJobs,
      };
    }
  });

  const id = cache.identify({ __typename: "Job", id: addedJob.id });
  cache.evict({ id, fieldName: "user" });
};

export const removeJobFromCache = (cache: ApolloCache<object>, id: string) => {
  const cacheId = cache.identify({ __typename: "Job", id });
  cache.evict({ id: cacheId });
  cache.gc();
};

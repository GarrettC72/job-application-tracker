import { useQuery } from "@apollo/client";

import { GET_USER_JOBS } from "../graphql/queries";

const useJobs = () => {
  const { data, ...result } = useQuery(GET_USER_JOBS);

  return { jobs: data?.allJobs, ...result };
};

export default useJobs;

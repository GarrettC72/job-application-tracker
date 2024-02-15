import { useQuery } from "@apollo/client";
import { USER_JOBS } from "../graphql/queries";

const useJobs = () => {
  const { data, ...result } = useQuery(USER_JOBS);

  return { jobs: data?.allJobs, ...result };
};

export default useJobs;

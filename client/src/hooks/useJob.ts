import { skipToken, useQuery } from "@apollo/client/react";
import { GET_JOB } from "../graphql/queries";

const useJob = (id: string) => {
  const { data, ...result } = useQuery(
    GET_JOB,
    id
      ? {
          variables: { id },
        }
      : skipToken
  );

  return { job: data?.getJob, ...result };
};

export default useJob;

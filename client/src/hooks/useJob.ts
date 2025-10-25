import { useQuery } from "@apollo/client/react";
import { GET_JOB } from "../graphql/queries";

const useJob = (id: string) => {
  const { data, ...result } = useQuery(GET_JOB, {
    skip: !id,
    variables: { id },
  });

  return { job: data?.getJob, ...result };
};

export default useJob;

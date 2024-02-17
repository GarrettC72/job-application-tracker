import { useQuery } from "@apollo/client";

import { GET_CURRENT_USER } from "../graphql/queries";

const useCurrentUser = () => {
  const { data, ...result } = useQuery(GET_CURRENT_USER);

  return { currentUser: data?.me, ...result };
};

export default useCurrentUser;

import { gql } from "../../src/__generated__/gql";

export const JOB_ADDED = gql(`#graphql
  subscription jobAdded {
    jobAdded {
      ...JobDetails
      user {
        id
        email
      }
    }
  }
`);

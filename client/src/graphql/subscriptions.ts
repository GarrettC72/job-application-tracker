import { gql } from "../../src/__generated__/gql";

export const JOB_ADDED = gql(`#graphql
  subscription jobAddedSubscription {
    jobAdded {
      ...SubscriptionJobDetails
    }
  }
`);

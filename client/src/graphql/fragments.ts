import { gql } from "../../src/__generated__/gql";

export const JOB_DETAILS = gql(`#grpahql
  fragment JobDetails on Job {
    companyName
    jobTitle
    latestActivity
    dateCreated
    lastModified
    id
  }
`);

export const FULL_JOB_DETAILS = gql(`#graphql
  fragment FullJobDetails on Job {
    companyName
    companyWebsite
    jobTitle
    jobPostingLink
    contactName
    contactTitle
    activities {
      activityType
      date
      description
    }
    notes
    id
  }
`);

export const SUBSCRIPTION_JOB_DETAILS = gql(`#graphql
  fragment SubscriptionJobDetails on SubscriptionJob {
    companyName
    jobTitle
    latestActivity
    dateCreated
    lastModified
    user {
      email
      id
    }
    id
  }
`);

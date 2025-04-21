import { gql } from "../../src/__generated__/gql";

export const JOB_DETAILS = gql(`#graphql
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

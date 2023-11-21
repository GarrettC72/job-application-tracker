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

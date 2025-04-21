import { gql } from "../../src/__generated__/gql";

export const JOB_ADDED = gql(`#graphql
  subscription jobAdded {
    jobAdded {
      companyName
      jobTitle
      latestActivity
      dateCreated
      lastModified
      id
      user {
        email
      }
    }
  }
`);

export const JOB_UPDATED = gql(`#graphql
  subscription jobUpdated {
    jobUpdated {
      ...FullJobDetails
      companyName
      jobTitle
      latestActivity
      dateCreated
      lastModified
      id
      user {
        email
      }
    }
  }
`);

export const JOB_DELETED = gql(`#graphql
  subscription jobDeleted {
    jobDeleted {
      companyName
      jobTitle
      id
      user {
        email
      }
    }
  }
`);

import { gql } from "../../src/__generated__/gql";

export const VERIFY_PASSWORD_RESET = gql(`#graphql
  query verifyPasswordReset($token: String!) {
    getPasswordReset(token: $token) {
      id
      email
    }
  }
`);

export const USER_JOBS = gql(`#graphql
  query userJobs {
    allJobs {
      companyName
      jobTitle
      latestActivity
      dateCreated
      lastModified
      id
    }
  }
`);

export const CURRENT_USER = gql(`#graphql
  query currentUser {
    me {
      email
      firstName
      lastName
      id
    }
  }
`);

export const JOB_BY_ID = gql(`#graphql
  query jobById($id: ID!) {
    getJob(id: $id) {
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
  }
`);

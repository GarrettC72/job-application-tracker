import { gql } from "../../src/__generated__/gql";

export const VERIFY_PASSWORD_RESET = gql(`#graphql
  query verifyPasswordReset($token: String!) {
    getPasswordReset(token: $token) {
      id
      email
    }
  }
`);

export const GET_USER_JOBS = gql(`#graphql
  query userJobs {
    allJobs {
      ...JobDetails @unmask(mode: "migrate")
    }
  }
`);

export const GET_CURRENT_USER = gql(`#graphql
  query currentUser {
    me {
      email
      firstName
      lastName
      id
    }
  }
`);

export const GET_JOB = gql(`#graphql
  query getJob($id: ID!) {
    getJob(id: $id) {
      ...FullJobDetails @unmask(mode: "migrate")
    }
  }
`);

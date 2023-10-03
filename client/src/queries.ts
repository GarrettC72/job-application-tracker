import { gql } from "../src/__generated__/gql";

export const LOGIN = gql(`#graphql
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      email
      name
    }
  }
`);

export const REGISTER = gql(`#graphql
  mutation register($email: String!, $password: String!,
  $confirmPassword: String!, $firstName: String!, $lastName: String!) {
    createUser(
      email: $email,
      password: $password,
      confirmPassword: $confirmPassword,
      firstName: $firstName,
      lastName: $lastName
    ) {
      id
      email
      verified
    }
  }
`);

export const VERIFY_USER = gql(`#graphql
  mutation verifyUser($token: String!) {
    verifyUser(token: $token) {
      id
      email
      verified
    }
  }
`);

export const RESEND_VERIFICATION = gql(`#graphql
  mutation resendVerification($token: String!) {
    resendVerification(token: $token) {
      id
      email
      verified
    }
  }
`);

export const SEND_PASSWORD_RESET = gql(`#graphql
  mutation sendPasswordReset($email: String!) {
    createPasswordReset(email: $email) {
      id
      email
    }
  }
`);

export const VERIFY_PASSWORD_RESET = gql(`#graphql
  query verifyPasswordReset($token: String!) {
    getPasswordReset(token: $token) {
      id
      email
    }
  }
`);

export const EDIT_PASSWORD = gql(`#graphql
  mutation editPassword($token: String!, $password: String!,
  $confirmPassword: String!) {
    updateUser(
      token: $token,
      password: $password,
      confirmPassword: $confirmPassword
    ) {
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
    }
  }
`);

export const CREATE_JOB = gql(`#graphql
  mutation createJob($companyName: String!, $companyWebsite: String!,
  $jobTitle: String!, $jobPostingLink: String!, $contactName: String!,
  $contactTitle: String!, $activities: [ActivityInput!]!, $notes: String!) {
    addJob(
      companyName: $companyName,
      companyWebsite: $companyWebsite
      jobTitle: $jobTitle,
      jobPostingLink: $jobPostingLink,
      contactName: $contactName,
      contactTitle: $contactTitle,
      activities: $activities,
      notes: $notes
    ) {
      companyName
      jobTitle
      latestActivity
      dateCreated
      lastModified
      id
    }
  }
`);

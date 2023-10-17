import { gql } from "../../src/__generated__/gql";

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

export const CREATE_JOB = gql(`#graphql
  mutation createJob($jobParams: JobMutationInput!) {
    addJob(jobParams: $jobParams) {
      companyName
      jobTitle
      latestActivity
      dateCreated
      lastModified
      id
    }
  }
`);

export const UPDATE_JOB = gql(`#graphql
  mutation updateJob($id: ID!, $jobParams: JobMutationInput!) {
    updateJob(id: $id, jobParams: $jobParams) {
      companyName
      jobTitle
      latestActivity
      dateCreated
      lastModified
      id
    }
  }
`);

export const DELETE_JOB = gql(`#graphql
  mutation deleteJob($id: ID!) {
    deleteJob(id: $id) {
      companyName
      jobTitle
      id
    }
  }
`);

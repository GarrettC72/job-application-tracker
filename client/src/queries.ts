import { gql } from "../src/__generated__/gql";

export const LOGIN = gql(`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      email
      name
    }
  }
`);

export const REGISTER = gql(`
  mutation register($email: String!, $password: String!,
  $confirmPassword: String!, $firstName: String!, $lastName: String!) {
    createUser(email: $email, password: $password,
    confirmPassword: $confirmPassword, firstName: $firstName,
    lastName: $lastName) {
      id
      email
      verified
    }
  }
`);

export const VERIFY_USER = gql(`
  mutation verifyUser($token: String!) {
    verifyUser(token: $token) {
      id
      email
      verified
    }
  }
`);

export const RESEND_VERIFICATION = gql(`
  mutation resendVerification($token: String!) {
    resendVerification(token: $token) {
      id
      email
      verified
    }
  }
`);

export const SEND_PASSWORD_RESET = gql(`
  mutation sendPasswordReset($email: String!) {
    createPasswordReset(email: $email) {
      id
      email
    }
  }
`);

export const VERIFY_PASSWORD_RESET = gql(`
  query verifyPasswordReset($token: String!) {
    getPasswordReset(token: $token) {
      id
      email
    }
  }
`);

export const EDIT_PASSWORD = gql(`
  mutation editPassword($token: String!, $password: String!, $confirmPassword: String!) {
    updateUser(token: $token, password: $password, confirmPassword: $confirmPassword) {
      id
      email
    }
  }
`);

export const USER_JOBS = gql(`
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

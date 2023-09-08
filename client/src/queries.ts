import { gql } from '../src/__generated__/gql';

export const LOGIN = gql(`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      value
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

export const SEND_PASSWORD_RESET = gql(`
  mutation sendPasswordReset($email: String!) {
    createPasswordReset(email: $email) {
      id
      email
      verified
    }
  }
`);

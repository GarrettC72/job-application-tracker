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

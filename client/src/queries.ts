import { gql } from '../src/__generated__/gql';

export const LOGIN = gql(`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      value
    }
  }
`);

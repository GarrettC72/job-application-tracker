export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verified: boolean;
}

export interface VerificationToken {
  email: string;
}

// export interface NewUser {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   verified: boolean;
// }

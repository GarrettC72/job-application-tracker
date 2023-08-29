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

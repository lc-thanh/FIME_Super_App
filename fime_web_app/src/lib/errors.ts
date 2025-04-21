import { AuthError } from "next-auth";

export class InvalidUsernameError extends AuthError {
  static type = "InvalidUsername";
}

export class InvalidPasswordError extends AuthError {
  static type = "InvalidPassword";
}

export class LockedAccountError extends AuthError {
  static type = "LockedAccount";
}

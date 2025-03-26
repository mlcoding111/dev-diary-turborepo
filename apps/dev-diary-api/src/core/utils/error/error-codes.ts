// Export an enum of error codes
// Export the type of error codes
export enum ErrorCode {
  USER_NOT_FOUND = 'User not found',
}

export type TErrorCode = keyof typeof ErrorCode;

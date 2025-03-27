// Export an enum of error codes
// Export the type of error codes
export enum ErrorCode {
	USER_NOT_FOUND = "User not found",
    INTERNAL_SERVER_ERROR = "Internal server error",
    UNKNOWN_ERROR = "Unknown error",
    VALIDATION_ERROR = "Validation error",
    NOT_FOUND = "Not found",
}

export type TErrorCode = keyof typeof ErrorCode;

export type TApiResponse<T> = {
	success: boolean;
	status_code: number;
	message: string;
	data: T;
	metadata?: Record<string, any>;
};

// Payload when calling the ApiError constructor
export type TExceptionErrorPayload = Pick<TApiResponse<null>, 'data' | 'message' | 'metadata' | 'status_code'> & {
	error_code: string;
};

export type TExceptionErrorResponse = TApiResponse<null> & {
	success: false;
	error_code: string;
	path: string;
};

export type TSuccessResponse<T> = TApiResponse<T> & {
	success: true;
};

export type TExceptionError = TExceptionErrorResponse & {
	statusCode: 500;
};
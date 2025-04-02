import { TErrorCode } from './error-codes';

export type TApiResponse<T> = {
	success: boolean;
	status_code: number;
	message?: string;
	data: T | null | T[];
	metadata?: Record<string, any>;
};

export type TErrorDataType = Record<string, any> | null;

export type TApiResponseError = Omit<TApiResponse<null>, "data"> & {
	data: TErrorDataType;
	timestamp: string;
	error_code: TErrorCode;
	path: string;
	stack?: string | null | undefined;
};

export type TApiResponseInternalError = Omit<TApiResponseError, "data"> & {
	data?: TErrorDataType;
};

export type TApiResponseValidationError = Omit<TApiResponseInternalError, "data"> & {
	data: TErrorDataType & {
		fields: Record<string, any>;
	};
};

export type TExceptionErrorPayload = Pick<
	TApiResponseError,
	 "message" | "metadata" | "status_code"
> & {
	error_code: TErrorCode;
	data?: TErrorDataType;
};

export type TExceptionErrorResponse = Omit<TApiResponse<null>, "data"> & {
	success: false;
	error_code: TErrorCode;
	path: string;
	stack?: string | null | undefined;
	timestamp: string;
};

export type TInternalErrorPayload = Pick<TApiResponse<null>, "metadata"> & {
	message?: string;
};

export type TApiResponseSuccess<T> = Omit<TApiResponse<T>, "status_code"> & {
	success: true;
};

export type TExceptionError = TExceptionErrorResponse & {
	statusCode: 500;
};

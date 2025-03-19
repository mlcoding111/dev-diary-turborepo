export type TApiResponse<T> = {
	success: boolean;
	status_code: number;
	message: string;
	data: T;
	metadata?: Record<string, any>;
};

export type TExceptionErrorPayload = Pick<
	TApiResponse<null>,
	"data" | "message" | "metadata" | "status_code"
> & {
	error_code: string;
};

export type TExceptionErrorResponse = Omit<TApiResponse<null>, "data"> & {
	success: false;
	error_code: string;
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

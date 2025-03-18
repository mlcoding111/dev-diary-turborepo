export type TApiResponse<T> = {
	success: boolean;
	http_status_code: number;
    error_code?: string;
	message: string;
	data: T;
	metadata?: Record<string, any>;
};

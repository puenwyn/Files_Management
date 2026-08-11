import { HttpStatus } from "@nestjs/common";

export interface ApiResponse<T> {
    statusCode: HttpStatus,
    success: boolean;
    error: ApiError | null;
    data: T | null;
}

export interface ApiError {
    code: string;
    message: string | string[];
}
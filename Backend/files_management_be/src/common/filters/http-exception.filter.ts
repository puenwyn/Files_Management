import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = "Internal server error";
        let code = "INTERNAL_SERVER_ERROR";

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === "string") {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === "object" && exceptionResponse !== null
            ) {
                const errorResponse = exceptionResponse as {
                    message?: string | string[];
                    error?: string;
                };

                if (errorResponse.message) {
                    message = errorResponse.message;
                }
            }
            code = this.getErrorCode(statusCode);
        }
        response.status(statusCode).json({
            statusCode,
            success: false,
            error: {
                code,
                message,
            },
            data: null,
        })
    }

    private getErrorCode(statusCode: number): string {
        switch (statusCode) {
            case HttpStatus.BAD_REQUEST:
                return 'BAD_REQUEST';
            case HttpStatus.UNAUTHORIZED:
                return 'UNAUTHORIZED';
            case HttpStatus.FORBIDDEN:
                return 'FORBIDDEN';
            case HttpStatus.NOT_FOUND:
                return 'NOT_FOUND';
            case HttpStatus.CONFLICT:
                return 'CONFLICT';
            case HttpStatus.UNPROCESSABLE_ENTITY:
                return 'UNPROCESSABLE_ENTITY';
            case HttpStatus.TOO_MANY_REQUESTS:
                return 'TOO_MANY_REQUESTS';
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return 'INTERNAL_SERVER_ERROR';
            default:
                return 'HTTP_ERROR';
        }
    }
}
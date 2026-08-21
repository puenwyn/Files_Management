import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResponse } from "../interfaces/api-response.interface";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>
    ): Observable<ApiResponse<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const defaultStatus = response?.statusCode ?? HttpStatus.OK;

        return next.handle().pipe(
            map((data: T) => ({
                statusCode: defaultStatus,
                success: true,
                error: null,
                data: data ?? null
            })),
        )
    }
}
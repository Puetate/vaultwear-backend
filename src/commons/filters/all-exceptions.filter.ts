import { GLOBAL_ERRORS_MESSAGES } from "@commons/constants";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { FastifyReply } from "fastify";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const { status, error } = this.getStatusAndError(exception);
    const errorResponse = { error };
    this.logger.error({ exception, errorResponse });
    response.status(status).send(errorResponse);
  }

  getStatusAndError(exception: any): { status: number; error: string } {
    if (exception instanceof HttpException) {
      const httpErrorResponse = this.getHttpErrorResponse(exception);
      return httpErrorResponse;
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: GLOBAL_ERRORS_MESSAGES[InternalServerErrorException.name]
    };
  }

  getHttpErrorResponse(exception: any): { status: number; error: string } {
    const status = exception.status || exception.getStatus();
    const error = GLOBAL_ERRORS_MESSAGES[exception.constructor.name] || exception.getResponse();
    return { error, status };
  }
}

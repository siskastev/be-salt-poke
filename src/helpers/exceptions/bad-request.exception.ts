import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const errors = exception.getResponse()['message'];

        if (Array.isArray(errors)) {
            const formattedErrors = this.formatErrors(errors);
            return response.status(400).json({
                message: formattedErrors,
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        return response.status(400).json({
            message: errors,
            error: 'Bad Request',
            statusCode: 400,
        });
    }

    private formatErrors(errors: string[]): Record<string, string[]> {
        const groupedErrors: Record<string, string[]> = {};
        errors.forEach((error) => {
            const [fieldName] = error.split(' ');
            const formattedError = this.camelCaseToSentence(error);
            if (groupedErrors[fieldName]) {
                groupedErrors[fieldName].push(formattedError);
            } else {
                groupedErrors[fieldName] = [formattedError];
            }
        });
        return groupedErrors;
    }

    private camelCaseToSentence(str: string): string {
        return str.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + str.slice(1);
    }
}

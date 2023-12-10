import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodObject, ZodRawShape, ZodError, ZodIssue } from 'zod';

function formatError(zodError: ZodError) {
  const errors = {};

  zodError.issues.forEach((error: ZodIssue) => {
    const key = error.path.join('.');

    if (!errors[key]) {
      errors[key] = [];
    }
    (errors[key] as string[]).push(error.message);
  });

  return errors;
}

@Injectable()
export class ZodValidationPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T>) {}

  async transform(value: unknown) {
    const result = await this.schema.safeParseAsync(value);

    if (result.success === false) {
      throw new HttpException(
        formatError(result.error),
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}

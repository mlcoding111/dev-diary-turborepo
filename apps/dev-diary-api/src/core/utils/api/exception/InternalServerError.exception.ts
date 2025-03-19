import { InternalServerErrorException } from '@nestjs/common';
import { TInternalErrorPayload } from '@repo/types/api';

export class InternalServerError extends InternalServerErrorException {
  private metadata: Record<string, any>;

  constructor({ metadata = {} }: TInternalErrorPayload) {
    super({
      metadata,
    });

    this.metadata = metadata as Record<string, any>;
  }
}

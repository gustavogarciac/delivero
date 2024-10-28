import { UseCaseError } from "./use-case-error";

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Bad Request Error');
  }
}
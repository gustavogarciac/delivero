import { UseCaseError } from "./use-case-error";

export class BadRequestError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Bad Request Error');
  }
}
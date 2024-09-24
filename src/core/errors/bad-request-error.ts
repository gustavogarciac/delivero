import { UseCaseError } from "./use-case-error";

export class BadRequestError extends Error implements UseCaseError {
  constructor() {
    super("Bad request");
  }
}
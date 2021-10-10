import { ApolloError } from "apollo-server-errors";

export class AlreadyExistsError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, "ALREADY_EXISTS", extensions);

    Object.defineProperty(this, "name", { value: "AlreadyExistsError" });
  }
}

export class Result<T> {
  private constructor(
    private readonly isSuccess: boolean,
    private readonly value?: T,
    private readonly error?: string,
  ) {}

  static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, value);
  }

  static fail<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  get succeeded(): boolean {
    return this.isSuccess;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cannot get value of a failed result: ${this.error}`);
    }
    return this.value as T;
  }

  getError(): string {
    return this.error ?? '';
  }
}

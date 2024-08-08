export abstract class BaseError {
  protected constructor(
    protected readonly _type: string,
    protected readonly _name: string,
    protected readonly _message: string,
  ) {}

  public get type(): string {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }

  public get message(): string {
    return this._message;
  }
}

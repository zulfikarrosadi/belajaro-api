export default class BadRequest extends Error {
  public details: { path: string; value: string }[];

  constructor(message: string, details: { path: string; value: string }[]) {
    super();
    this.message = message;
    this.details = details;
  }
}

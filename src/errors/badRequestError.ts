export default class BadRequest extends Error {
  public path: string;
  public value: string;

  constructor(message: string, path?: string, value?: string) {
    super();
    this.message = message;
    this.path = path || '';
    this.value = value || '';
  }
}

export default class NotFound extends Error {
  constructor(message: string) {
    super(message);
  }
}

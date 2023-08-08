import BadRequest from './badRequestError';
import NotFound from './notFoundError';

export default class ErrorFactory {
  static createBadRequestError(
    message: string,
    details: { path: string; value: string }[],
  ): BadRequest {
    return new BadRequest(message, details);
  }

  static createNotFoundError(message: string): NotFound {
    return new NotFound(message);
  }
}

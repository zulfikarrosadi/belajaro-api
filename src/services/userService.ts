import { users } from '@prisma/client';
import BadRequest from '../errors/badRequestError';
import { defaultResponse } from '../global';
import { hashPassword } from '../helpers/passwordHelper';
import { createUser } from '../repositories/userRepository';

export async function createUserService(user: users): Promise<defaultResponse> {
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;

  try {
    const result = await createUser(user);

    return { status: 'success', data: { email: result.email, id: result.id } };
  } catch (error) {
    console.log(error);
    return {
      status: 'fail',
      error: {
        message: 'email already exists',
        details: [{ path: 'email' }],
      },
    };
  }
}

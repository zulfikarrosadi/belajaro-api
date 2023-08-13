import { User } from '@prisma/client';
import BadRequest from '../errors/badRequestError';
import ErrorFactory from '../errors/errorFactory';
import { defaultResponse } from '../global';
import { hashPassword } from '../helpers/passwordHelper';
import { createUser, updateUser } from '../repositories/userRepository';

export async function createUserService(user: User): Promise<defaultResponse> {
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

export async function updateUserService(user: User): Promise<defaultResponse> {
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;
  try {
    const updatedUser = await updateUser(user);
    if (!updatedUser) {
      throw ErrorFactory.createNotFoundError('fail to update user');
    }
    return {
      status: 'success',
      code: 200,
      data: { id: updatedUser.id, email: updatedUser.email },
    };
  } catch (error) {
    return {
      status: 'fail',
      code: 404,
      error: { message: 'fail to update user' },
    };
  }
}

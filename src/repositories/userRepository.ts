import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(
  user: User,
): Promise<Pick<User, 'email' | 'id'>> {
  const result = await prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    select: { email: true, id: true },
  });

  return result;
}

export async function getUser(
  email: string,
): Promise<Pick<User, 'email' | 'password' | 'id'> | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  return user;
}

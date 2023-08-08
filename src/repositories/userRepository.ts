import { PrismaClient, users } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(
  user: users,
): Promise<Pick<users, 'email' | 'id'>> {
  const result = await prisma.users.create({
    data: {
      email: user.email,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
      school: user.school,
    },
    select: { email: true, id: true },
  });

  return result;
}

export async function getUser(
  email: string,
): Promise<Pick<users, 'email' | 'password' | 'id'> | null> {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  return user;
}

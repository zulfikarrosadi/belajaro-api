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
  console.log(result);
  return result;
}

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

export async function updateUser(user: User) {
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      password: user.password,
      profilePicture: user.profilePicture,
    },
    select: { id: true, email: true },
  });

  return updatedUser;
}

export async function getUserProfile(userId: number) {
  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true, firstname: true, profilePicture: true, post: {
        take: 50,
        where: { published: true },
        select: {
          title: true, content: true, created_at: true,
          forum: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });

  return userProfile;
}

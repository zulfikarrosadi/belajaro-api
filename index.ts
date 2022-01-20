import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      Post: {
        create: {
          title: 'My first post title',
          content: 'My first post content',
        },
      },
      Profile: {
        create: {
          bio: 'Wonder woman in wonder land',
        },
      },
    },
  });

  const allUser = await prisma.user.findMany({
    include: {
      Post: true,
      Profile: true,
    },
  });
  console.log(allUser);

  const update = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  });
  console.log(update);

  await prisma.post.create({
    data: {
      title: 'test tiel',
      User: {
        connect: { email: 'alice@prisma.io' },
      },
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })

  .finally(async () => {
    await prisma.$disconnect();
  });

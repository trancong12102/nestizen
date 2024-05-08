import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'user1@example.com',
        mappedField: '123',
      },
    ],
    skipDuplicates: true,
  });

  const user = await prisma.user.findFirstOrThrow();

  await prisma.post.createMany({
    data: [
      {
        title: 'Post 1',
        content: 'Content 1',
        authorId: user.id,
        anotherAuthorId: user.id,
        postKind: 'BLOG',
      },
      {
        title: 'Post 2',
        content: 'Content 2',
        authorId: user.id,
        anotherAuthorId: user.id,
        postKind: 'ADVERT',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

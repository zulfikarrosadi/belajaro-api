# Learn Prisma

## Create User, Post, Profile at the time
you can do this by specifying the related table in the ```data``` object
```js
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
```

## Include Object
tell prisma to return the ```Post``` and ```Profile``` field too
```js
await prisma.user.findMany({
    include: {
      Post: true,
      Profile: true,
    },
  });
```

## Update
update specific data by specifying the id in the ```where``` object, and the new data will be in ```data``` object
```js
await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  });
```

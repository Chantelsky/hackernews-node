const { PrismaClient } = require('@prisma/client');

// instantiate PrismaClient
const prisma = new PrismaClient();

// Define an async function called main to send queries to the db
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

// calling the main function
main()
  .catch((e) => {
    throw e;
  })
  // close the db connections when script terminates
  .finally(async () => {
    await prisma.$disconnect();
  });

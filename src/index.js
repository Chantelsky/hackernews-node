const { ApolloServer } = require('apollo-server');
// can attach an instance of PrismaClient to the context when the graphql server is being initalized
const { PrismaClient } = require('@prisma/client');

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => async (parent, args, context) => {
      return context.prisma.links.findMany();
    },
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.links.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
};

const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

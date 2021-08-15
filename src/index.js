const { ApolloServer } = require('apollo-server');
// 1 - adding a new integer variable that serves as a very rudimentary way to generate unique IDs for newly created Link elements.
let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

// 1 adding a new integer variable that simply serves as a very rudimentary way to generate unique IDs for newly created Link elements.
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // 2  implementation of the post resolver first creates a new link object, then adds it to the existing links list and finally returns the new link.
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
  },
};

const fs = require('fs');
const path = require('path');

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

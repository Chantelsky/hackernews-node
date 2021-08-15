const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function post(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

async function signup(parent, args, context, info) {
  // encrypt users password using bcryptjs
  const password = await bcrypt.hash(args.password, 10);
  // using PrismaClient instance to store the new user record in the db
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  // generating a JSON web token which is signed with an APP_SECRET.
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // return the token and the user in an object that adheres to the shape of an AuthPayload object from graphql schema
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  // Using PrismaClient to retrieve an existing user record by the email address that was sent along as an argument in the login mutation
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error('No such user found');
  }
  // compare the provided password with the one stored in the db
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid Password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // return token and user
  return {
    token,
    user,
  };
}

module.exports = {
  signup,
  login,
  post,
};

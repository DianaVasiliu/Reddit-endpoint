const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require('graphql');
const commentType = require('./commentType');

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => {
    const userType = require('./userType');
    const communityType = require('./communityType');

    return {
      id: {
        type: GraphQLID,
      },
      title: {
        type: GraphQLString,
      },
      body: {
        type: GraphQLString,
      },
      author: {
        type: userType,
        resolve: async (source) => {
          return await source.getUser();
        }
      },
      community: {
        type: communityType,
        resolve: async (source) => {
          return await source.getCommunity();
        }
      },
      comments: {
        type: new GraphQLList(commentType),
        resolve: async (source) => {
          return await source.getComments();
        }
      },
    }
  },
});

module.exports = postType;
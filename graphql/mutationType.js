const {
  GraphQLObjectType
} = require('graphql');

const loginInputType = require('./inputTypes/loginInputType');
const createUserInputType = require('./inputTypes/createUserInputType');
const createPostInputType = require('./inputTypes/createPostInputType');
const createCommunityInputType = require('./inputTypes/createCommunityInputType')
const updateUserInputType = require('./inputTypes/updateUserInputType');
const updatePostInputType = require('./inputTypes/updatePostInputType');
const updateCommunityInputType = require('./inputTypes/updateCommunityInputType');
const updateSubscriptionInputType = require('./inputTypes/updateSubscriptionInputType');
const toggleAdminOrModeratorInputType = require('./inputTypes/toggleAdminOrModeratorInputType');
const updateReactionInputType = require('./inputTypes/updateReactionInputType');
const createMessageInputType = require('./inputTypes/createMessageInputType');

const loginResultType = require('./types/loginResultType');
const userType = require('./types/userType');
const postType = require('./types/postType');
const communityType = require('./types/communityType');
const userCommunityType = require('./types/userCommunityType');
const updateSubscriptionResultType = require('./types/updateSubscriptionResultType');
const updateReactionResultType = require('./types/updateReactionResultType');
const messageType = require('./types/messageType');

const loginHandler = require('../repository/login');
const {
  createUser,
  updateUser,
  deleteUser,
  updateSubscription,
  toggleAdminOrModerator,
  updateReaction,
} = require('../repository/users');
const {
  createPost,
  updatePost,
  deletePost,
} = require('../repository/posts');
const {
  createCommunity, 
  updateCommunity,
  deleteCommunity,
} = require('../repository/communities');
const {
  createMessage,
} = require('../repository/messages');

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    login: {
      type: loginResultType,
      args: {
        loginInput: {
          type: loginInputType,
        }
      },
      resolve: (_, {
        loginInput
      }) => {
        const {
          email,
          password
        } = loginInput;

        const token = loginHandler(email, password);

        return {
          token,
        };
      }
    },
    createUser: {
      type: userType,
      args: {
        createUserInput: {
          type: createUserInputType,
        }
      },
      resolve: async (_, {
        createUserInput
      }) => {
        return createUser(createUserInput);
      }
    },
    updateUser: {
      type: userType,
      args: {
        updateUserInput: {
          type: updateUserInputType,
        },
      },
      resolve: async (_, {
        updateUserInput
      }, context) => {
        return updateUser(updateUserInput, context);
      }
    },
    deleteUser: {
      type: userType,
      resolve: async (_, __, context) => {
        return deleteUser(context);
      }
    },
    updateSubscription: {
      type: updateSubscriptionResultType,
      args: {
        updateSubscriptionInput: {
          type: updateSubscriptionInputType,
        },
      },
      resolve: async (_, {
        updateSubscriptionInput
      }, context) => {
        return updateSubscription(updateSubscriptionInput, context);
      }
    },
    toggleAdminOrModerator: {
      type: userCommunityType,
      args: {
        toggleAdminOrModeratorInput: {
          type: toggleAdminOrModeratorInputType,
        },
      },
      resolve: async (_, {
        toggleAdminOrModeratorInput
      }, context) => {
        return toggleAdminOrModerator(toggleAdminOrModeratorInput, context);
      }
    },
    updateReaction: {
      type: updateReactionResultType,
      args: {
        updateReactionInput: {
          type: updateReactionInputType,
        },
      },
      resolve: async (_, {
        updateReactionInput
      }, context) => {
        return updateReaction(updateReactionInput, context);
      }
    },
    createPost: {
      type: postType,
      args: {
        createPostInput: {
          type: createPostInputType
        },
      },
      resolve: async (_, {
        createPostInput
      }, context) => {
        return createPost(createPostInput, context);
      }
    },
    updatePost: {
      type: postType,
      args: {
        updatePostInput: {
          type: updatePostInputType
        },
      },
      resolve: async (_, {
        updatePostInput
      }, context) => {
        return updatePost(updatePostInput, context);
      }
    },
    deletePost: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        }
      },
      resolve: async (source, {
        id
      }, context) => {
        return deletePost(id);
      }
    },
    createCommunity: {
      type: communityType,
      args: {
        createCommunityInput: {
          type: createCommunityInputType
        },
      },
      resolve: async (_, {
        createCommunityInput
      }, context) => {
        return createCommunity(createCommunityInput, context);
      }
    },
    updateCommunity: {
      type: communityType,
      args: {
        updateCommunityInput: {
          type: updateCommunityInputType
        }
      },
      resolve: async (_, {
        updateCommunityInput
      }, context) => {
        return updateCommunity(updateCommunityInput, context);
      }
    },
    deleteCommunity: {
      type: communityType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        }
      },
      resolve: async (source, {
        id
      }, context) => {
        return deleteCommunity(id);
      }
    },
    createMessage: {
      type: messageType,
      args: {
        createMessageInput: {
          type: createMessageInputType
        }
      },
      resolve: async (_, {
        createMessageInput
      }, context) => {
        return createMessage(createMessageInput, context);
      }
    }
  },
})

module.exports = mutationType;
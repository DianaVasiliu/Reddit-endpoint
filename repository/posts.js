// Contains all the logic for the posts

const db = require('../models');

const getAllPosts = async () => {
    try {
        const allPosts = await db.Post.findAll()
        return allPosts
    } catch (error) {
        return {
            error
        };
    }
}

const getPostById = async (id) => {
    const postId = id

    try {
        const selectedPost = await db.Post.findByPk(postId)
        return selectedPost
    } catch (error) {
        return {
            error
        };
    }
}

const createPost = async (args, context) => {
    const {
        title,
        body,
        communityId
    } = args;
    const {
        user
    } = context;

    if (!user) {
        return {
            'error': 'Tried to create a post without being logged in (without having a token in Authorization header).'
        };
    }

    try {
        const newPost = await db.Post.create({
            title,
            body,
            communityId,
            'userId': user.id
        });

        return newPost
    } catch (error) {
        return {
            error
        };
    }
}

const updatePost = async (args, context) => {
    const { id, title, body } = args
    const selectedPost = await db.Post.findByPk(id)
    const { user } = context

    if (!user) {
        return {
            'error': 'Tried to update a post without being logged in (without having a token in Authorization header).'
        };
    }

    if (selectedPost.userId != user.id) {
        return {
            'error': 'Tried to update a post without being the author'
        };
    }

    try {
        await db.Post.update(
            {
                title,
                body,
            },
            {
                where: {
                    id,
                },
            }
        });

        return await db.Post.findByPk(id);
    } catch (error) {
        return {
            error
        };
    }
}

const deletePost = async (args, context) => {
    const { id } = args

    const { user } = context
    const selectedPost = await db.Post.findByPk(id)

    if (!user) {
        return {
            'error': 'Tried to delete a post without being logged in (without having a token in Authorization header).'
        };
    }

    if (selectedPost.userId != user.id) {
        return {
            'error': 'Tried to delete a post without being the author'
        };
    }

    try {
        await db.Post.destroy({
            where: {
                id,
            },
        })
        return {
            result: "Post deleted succesfully."
        };
    } catch (error) {
        return {
            error
        };
    }
}

const getAllPostReactions = async (req, res) => {
    const postId = parseInt(req.params.postId)

    try {
        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        const reactions = await db.PostReaction.findAll({
            where: {
                postId,
            },
        })

        const upvotes = reactions.filter((reaction) => reaction.isUpvote === 1)
        const nrUpvotes = upvotes.length
        const nrDownvotes = reactions.length - nrUpvotes

        const response = {
            upvotes: nrUpvotes,
            downvotes: nrDownvotes,
        }

        res.send(response)
    } catch (e) {
        console.error('Error:', e.message)
        res.send('Something went wrong')
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getAllPostReactions,
}

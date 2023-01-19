const { Book, User } = require('../models')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user == true) {
                return User.findOne({ _id: context.user.id }).select('-password')
            }
            throw new AuthenticationError('You must be logged in!')
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);

            if (!user) {
                throw ('You must be logged in!')
            }

            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('User not found!')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
              }

            const token = signToken(user);
            
            return { token, user }
        },
        removeBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            )
            if (!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
            }
            return updatedUser;
        },
        saveBook: async (parent, {newBook}, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: newBook }},
                { new: true, runValidators: true }
            )
            if (!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
            }
            return updatedUser;
        }
    }
}

module.exports = resolvers;
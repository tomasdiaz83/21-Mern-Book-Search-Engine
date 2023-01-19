const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Books {
        _id: ID!
        authors: String
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type User {
        username: String!
        
    }
`;

module.exports = typeDefs;
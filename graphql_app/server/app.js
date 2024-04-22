const express = require('express');

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require('cors');
const axios = require('axios');

const { USERS } = require('./users');
const { TODOS } = require('./todos');

async function startServer() {
    const PORT = 8000;
    const app = express();

    const apoloServer = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name : String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }

            type Todo {
                id: ID!
                title: String!
                completed : Boolean
                user : User
            }

            type Query {
                getTodos : [Todo]
                getAllUsers : [User]
                getUser(id: ID!) : User
            }
        `,
        resolvers: {
            Todo : {
                // user : async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data
                user : (todo) => USERS.find((user) => user.id === todo.id),
            },
            Query : {
                // getTodos : async () => (await axios.get("https://jsonplaceholder.typicode.com/todos")).data, 
                // getAllUsers : async () => (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
                // getUser : async (parent, {id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data

                getTodos : () => TODOS,
                getAllUsers : USERS,
                getUser : (parent, {id}) => USERS.find((user) => user.id === id)
            }
            
        }
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended : false }));
    app.use(cors());

    await apoloServer.start();
    
    app.use("/graphql", expressMiddleware(apoloServer));

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
};

startServer();
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGqlServer from './graphql';
import UserService from './services/user';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

// create a graphql server
async function initServer() {

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" })
    })

    app.use('/graphql', expressMiddleware(await createApolloGqlServer(), {

        context: async ({ req }) => {
            const token = req.headers['authorization'];
            try {
                const user = await UserService.verifyUserToken(token as string);
                return { user }
            } catch (error) {
                return {}
            }
        }
    }
    ));

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

initServer();
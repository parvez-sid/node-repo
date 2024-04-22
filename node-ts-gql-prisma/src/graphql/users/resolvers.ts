import UserService, { CreateUserPayload, UserTokenPayload }  from "../../services/user";

const queries = {

    getUserToken: async (_ : any, payload : UserTokenPayload) => {

        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password
        });
        return token
    },

    getCurrentUser : async (_: any, parameters: any, context : any) => {
        if(context && context.user){
            const userId = context.user.id;

            const user = await UserService.getUserById(userId);
            return user
        }
        throw new Error("Some error occured....")
    }
}

const mutations = {
    createUser: async (_: any, payload : CreateUserPayload) => {
        const res = UserService.createUser(payload);
        return (await res).id
    }
}

export const resolvers = { queries, mutations };
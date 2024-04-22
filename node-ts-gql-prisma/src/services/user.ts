import  JWT from "jsonwebtoken";
import { prisma } from "../lib/db";

const JWT_SECRET = "$up3rM@N@123";

export interface CreateUserPayload {
    firstName: string
    lastName?: string
    email : string
    password: string
}

export interface UserTokenPayload {
    email : string
    password: string
}

class UserService {
    // create a new user
    public static createUser(payload : CreateUserPayload) {

        const { firstName, lastName, email, password } = payload;

        return prisma.user.create({
            data: {
                firstName,
                lastName,
                password,
                email
            }
        });
    }

    // find a user by email
    private static getUserByEmail (email: string) {
        return prisma.user.findUnique({ where : { email }})
    }

    // geterate user token
    public static async getUserToken(payload : UserTokenPayload){

        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if(!user) throw new Error("User not found!");

        // Get Token
        const token = JWT.sign({
            id: user.id,
            email: user.email
        }, JWT_SECRET);

        return token;
    }

    // Verify user token
    public static async verifyUserToken(token : string){
        return JWT.verify(token, JWT_SECRET);
    }

    // get user by id
    public static async getUserById (id: string) {
        const user = await prisma.user.findUnique({ where : { id }});
        if(!user) throw new Error("User not found!");
        return user
    }
}

export default UserService;
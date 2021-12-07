import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

export default {
    Query: {
        seeFullPost: async(_, args, {request})=>{
            isAuthenticated(request);
            const {id} = args;

            return prisma.post({id});
        }
    }
}
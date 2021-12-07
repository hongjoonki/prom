import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

export default {
    Query: {
        seePick: async(_, __,{request})=>{
            isAuthenticated(request);
            const {user} = request;
            return prisma.picks({where:{
                user:{
                    id:user.id
                }
            }});
        }
    }
}

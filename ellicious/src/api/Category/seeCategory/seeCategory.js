import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

export default {
    Query: {
        seeCategory: async(_, args,{request})=>{
            isAuthenticated(request);
            const {userId} = args;
            const {user} = request;

            if(!userId){
                return prisma.categories({where:{
                    user:{
                        id:user.id
                    }
                }})
            }
            else{
            return prisma.categories({where:{
                user:{
                    id:userId
                }
            }});
        }
    }
    }
}

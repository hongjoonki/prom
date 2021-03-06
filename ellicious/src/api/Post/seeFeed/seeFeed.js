import { isAuthenticated } from "../../../middlewares";
import {prisma} from '../../../../generated/prisma-client';

export default {
    Query:{
        seeFeed: async(_,args,{request})=>{
            isAuthenticated(request);
            const {user} = request;
            const following = await prisma.user({id:user.id}).following();

            return prisma.posts({
                first: args.items,
                skip: args.pageNumber,
                where:{
                    user:{
                        id_in:[...following.map(user=>user.id), user.id]
                    }
                },
                orderBy:"createdAt_DESC"
            })
        }
    }
}
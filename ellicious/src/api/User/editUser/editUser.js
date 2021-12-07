import { isAuthenticated } from "../../../middlewares";
import {prisma} from '../../../../generated/prisma-client';

export default {
    Mutation: {
        editUser: async(_,args, {request})=>{
            isAuthenticated(request);
            const {user} = request;
            const {username, firstName, lastName, bio, avatar, notifyToken } = args;

            return prisma.updateUser({
                where:{
                    id:user.id
                },
                data:{username, firstName, lastName, bio, avatar, notifyToken}
            });
        }
    }
}
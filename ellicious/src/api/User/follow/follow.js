import { isAuthenticated } from "../../../middlewares";
import {prisma} from '../../../../generated/prisma-client';

export default {
    Mutation: {
        follow: async(_,args,{request})=>{
            isAuthenticated(request);
            const {user} = request;  //follow할 상대 ID 
            const {id} = args;
            try{
                await prisma.updateUser({where:{id:user.id}, data:{following:{connect:{id}}}});
                await prisma.createAlarm({
                    from:{
                        connect: {
                            id: user.id
                        }
                    },
                    to: id,
                    category:"follow",
                    check: false
                })
                return true;
            }
            catch (error){
                return false;
            }
        }
    }
}
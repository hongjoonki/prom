import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
    Query : {
        checkRoom: async(_,args,{request})=>{
            isAuthenticated(request);
            const {id} = args
            const {user} = request;
            const canSee = await prisma.rooms({
                where:{
                AND:[{
                    participants_some:{
                        id:user.id
                    }
                },
                    {
                    participants_some:{
                        id: id
                    }
                    }]
                }
            })
        
            if(canSee[0]){
                return canSee[0].id;
            }
            else{
                return null;
            }
            

            
        }
    }
}
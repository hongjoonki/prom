import { prisma } from "../../../../generated/prisma-client";

export default {
    Query:{
        checkUsername: async(_,args)=>{
            const {term} = args;
            const data =  await prisma.users({
                where:{
                    username: term
                }
            });

            if(data[0]){
                return true;
            }else{
                return false;
            }
        }
    }
}
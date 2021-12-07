import { prisma } from "../../../../generated/prisma-client";
export default {
    Subscription : {
        newAlarm:{
            subscribe: (_,args)=>{
            const {id} = args;

            //console.log(user.id)
            return prisma.$subscribe.alarm({
                AND:[
                    {mutation_in:"CREATED"},
                    {
                        node: {
                            to: id
                        }
                    }
                ]
            }).node();
        },
        resolve: payload=>payload
    }
}
}
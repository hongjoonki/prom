import {prisma} from '../../../../generated/prisma-client';

export default {
    Mutation: {
        checkAlarm: async(_,args)=>{
            const { alarmId, check } = args;

            return prisma.updateAlarm({
                where:{
                    id:alarmId
                },
                data:{check}
            });
        }
    }
}
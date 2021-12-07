import {prisma} from '../../../../generated/prisma-client';
import {generateSecretCode, sendSecretSMS, sendSMS} from '../../../utils';

export default {
    Mutation:{
        updatePassword: async(_, args)=>{
            const {phoneNum, password} = args;
            const user = await prisma.user({phoneNum});
            if(user){
                try{
                    await prisma.updateUser({where:{phoneNum:user.phoneNum}, data:{password:password}});
                    return true;
                }catch(error){
                    console.log(error);
                    return false;
                }
            }
            
        }
    }
}
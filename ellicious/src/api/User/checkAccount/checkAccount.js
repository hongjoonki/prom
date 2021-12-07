import {prisma} from '../../../../generated/prisma-client';

export default {
    Query: {
      checkAccount: async (_, args) => {
        const { phoneNum } = args;
        const user = await prisma.user({phoneNum});
        if(user){
            return true;
        }else{
            return false;
        }
      }
    }
}
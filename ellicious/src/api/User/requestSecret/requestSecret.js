import {prisma} from '../../../../generated/prisma-client';
import {generateSecretCode, sendSecretSMS, sendSMS} from '../../../utils';

export default {
    Mutation:{
        requestSecret: async(_, args)=>{
            const {phoneNum} = args;
            const secretNumber = generateSecretCode();   //secret code 생성  utils에 명시해놈.
            console.log(secretNumber)
            try{
                await sendSecretSMS(phoneNum, secretNumber);
                return secretNumber;
            }catch(error){
                console.log(error);
                return secretNumber;
            }
        }
    }
}
import {prisma} from '../../../../generated/prisma-client';

export default{
    Mutation:{
        createAccount: async(_, args)=>{
            const { username, phoneNum, password, firstName= "", lastName="", bio=""} = args;
            const exists = await prisma.$exists.user({
                OR: [
                    { phoneNum}
                ]
            });
            if(exists){
                throw Error("아이디나, 이메일, 휴대폰 번호가 겹칩니다.");
            }
            try {
                await prisma.createUser({
                    username,
                    firstName,
                    lastName,
                    password,
                    phoneNum
                });
                
            } catch (error) {
                throw Error("생성 실패")
            } finally{
                const user = await prisma.user({phoneNum});
                if(user){
                    return user;
                }else{
                    return null;
                }
            }
        }

    }
}
import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        addComment: async (_, args, {request})=>{
            isAuthenticated(request);
            const {user} = request;
            const {text, postId, headComment} = args;
            //const token = await prisma.user()
            if(!headComment){
                return prisma.createComment({
                    user:{
                        connect:{
                            id: user.id
                        }
                    },
                    post:{
                        connect:{
                            id: postId
                        }
                    },
                    text
                });
            }else {
                return prisma.createComment({
                    user:{
                        connect:{
                            id:user.id
                        }
                    },
                    
                    post:{
                        connect:{
                            id: postId
                        }
                    },
                    text,
                    headComment:{
                        connect:{
                            id: headComment
                        }
                    }
                });
            }
            
        }
    }
}
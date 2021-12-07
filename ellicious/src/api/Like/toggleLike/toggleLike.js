import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";
import axios from 'axios';

export default {
    Mutation:{
        toggleLike: async(_,args,{request})=>{
            isAuthenticated(request);
            const {user} = request;
            const {postId, toId} = args;
            const token = await prisma.post({id:postId}).user().notifyToken();
            //const token = await prisma.post({id:postId}).user().notifyToken();

            const filterOptions = {
                AND : [
                    {
                        user: {
                            id: user.id
                        }
                    },
                    {
                        post: {
                            id: postId
                        }
                    }
                ]
            }; //prisma exist 문법.

            try{
                const existingLike = await prisma.$exists.like(filterOptions);
                if (existingLike){
                    await prisma.deleteManyLikes(filterOptions);
                }else {
                    await prisma.createLike({
                        user: {
                            connect:{
                                id: user.id
                            }
                        },
                        post: {
                            connect:{
                                id:postId
                            }
                        }
                    });
                    if(user.id !== toId) {
                        await prisma.createAlarm({
                            from:{
                                connect: {
                                    id: user.id
                                }
                            },
                            post: {
                                connect:{
                                    id:postId
                                }
                            },
                            to: toId,
                            category:"like",
                            check: false
                        })
                    }

                    if(token){
                        const {data} = await axios.post("https://exp.host/--/api/v2/push/send",{
                        to : token,
                        title:"ellicous",
                        body: `${user.username}님이 게시물에 좋아요를 눌렸습니다`
                    });
                    }
                }
                return true;
            } catch{
                return false;
            }

        }
    }
}
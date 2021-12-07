import { prisma } from "../../../generated/prisma-client";

export default {
     Post: {
        category: (parent)=>prisma.post({id:parent.id}).category(),
        likeCount: (parent)=>prisma.likesConnection({where:{post:{id:parent.id}}}).aggregate().count(),//좋아요 연결
        pickCount: (parent)=>prisma.picksConnection({where:{post:{id:parent.id}}}).aggregate().count(), //콕집기 개수
        files: ({id})=> prisma.post({id}).files(),
        comments: ({id})=> prisma.post({ id}).comments(),
        commentCount: parent =>
        prisma
            .commentsConnection({
            where: { post: { id: parent.id } }
            })
            .aggregate()
            .count(),
        user: ({id})=> prisma.post({id}).user(),
        picked:({id})=> prisma.post({id}).picked(),
        likes:({id})=> prisma.post({id}).likes(),
        isLiked: async(parent, _ , {request})=>{
             const {user} = request;
             const {id} = parent;

             return prisma.$exists.like({
                 AND: [
                     {
                         user:{
                             id:user.id
                         }
                     },
                     {
                         post:{
                             id
                         }}
                 ]
             });
         },
         
        isPicked: async(parent, _ , {request})=>{
            const {user} = request;
            const {id} = parent;
            return prisma.$exists.pick({
                AND: [
                    {
                        user:{
                            id:user.id
                        }
                    },
                    {
                        post:{
                            id
                        }
                    }
                ]
            });
            
         }


     }
}
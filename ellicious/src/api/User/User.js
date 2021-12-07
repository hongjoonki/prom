import { prisma } from "../../../generated/prisma-client";

export default{
    User : {
        picks:({id})=>prisma.user({id}).picks(),
        following: ({id})=>prisma.users({where:{followers_some:{id}}}),
        followers: ({id})=>prisma.users({where:{following_some:{id}}}),

        category:({id})=>prisma.categories({where:{user:{id}}}),
        categoryCount:({id})=>prisma.categoriesConnection({where:{user:{id}}}).aggregate().count(),
        rooms: ({id})=>prisma.rooms({where:{participants_some:{id}}}),
        postsCount: ({ id }) => prisma.postsConnection({ where: { user: { id } } }).aggregate().count(),
        followingCount: ({ id }) =>
        prisma
            .usersConnection({ where: { followers_some: { id } } })
            .aggregate()
            .count(),
        followersCount: ({ id }) =>
        prisma
            .usersConnection({ where: { following_some: { id } } })
            .aggregate()
            .count(),
        fullName: parent=>{
            return `${parent.firstName} ${parent.lastName}`;
        },
        feedCount: async({id})=>{
                
                const following = await prisma.user({id:id}).following();
                return prisma.postsConnection({
                    where:{
                        user:{
                            id_in:[...following.map(user=>user.id), id]
                        }
                    },
                }).aggregate().count()
            },





        isFollowing: async(parent,_,{request})=>{  //(parent, arg, request)
            const { user } = request;
            const { id: parentId} = parent;
            try{
                return prisma.$exists.user({
                    AND: [
                        {
                            id:parentId
                        },
                        {
                            followers_some:{
                                id: user.id
                            }
                        }
                ] //parentId 는 요청한 유저, user.id는 본인
                });
            }catch (error){
                console.log(error);
                return false;
            }
     
        },
        isSelf: (parent, _,{request})=>{
            const { user } = request;
            const { id: parentId} = parent;
            return user.id === parentId;
        },
        posts: ({id})=>prisma.user({id}).posts({orderBy:"createdAt_DESC"}),

        
        /*categoryCount: ({id})=>prisma
            .usersConnection({where:{category_some}})*/

    }
    
};
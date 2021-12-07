import { prisma } from "../../../generated/prisma-client";

export default {
    Category: {
        user: ({id})=>prisma.category({id}).user(),
        posts: ({id})=>prisma.posts({where:{category:{id}}})
    }
}

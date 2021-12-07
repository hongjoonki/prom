import { prisma } from "../../../generated/prisma-client";
export default {
    Pick: {
        user:({id})=> prisma.pick({id}).user(),
        post:({id})=> prisma.pick({id}).post(),

    }
}
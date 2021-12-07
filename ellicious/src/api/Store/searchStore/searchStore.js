import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        searchStore: async(_, args) => prisma.posts({
            where: {
                OR: [
                    { storeLocation_contains: args.term },
                    { storeName_contains: args.term }
                ]
            }
        })
    }
};
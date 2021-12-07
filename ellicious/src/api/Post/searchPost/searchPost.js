import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        searchPost: async(_, args) => prisma.posts({
            where: {
                OR: [
                    { storeLocation_starts_with: args.term },
                    { storeName_starts_with: args.term },
                    { placeId: args.term}
                ]
            }
        })
    }
};
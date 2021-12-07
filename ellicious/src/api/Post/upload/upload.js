import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation:{
        upload: async(_,args, {request})=>{
            isAuthenticated(request);
            const {user} = request;
            const { 
                storeName,
                storeLocation,
                caption,
                placeId,
                storeLat,
                storeLong,
                files,
                rating,
                category,  //categoryID
                details} = args
            
            const post = await prisma.createPost({
                caption,
                storeName,
                storeLocation,
                placeId,
                storeLat,
                storeLong,
                rating,
                details:{set:details},
                category:{connect:{id:category}},
                user:{connect:{id:user.id}},
                
            });

            files.forEach(
                async file => 
                await prisma.createFile({
                    url: file,
                    post:{
                        connect:{
                            id: post.id
                        }
                    }
                })
            );
            return post;
            
        }
    }
}
import { isAuthenticated } from "../../../middlewares";
import {prisma} from '../../../../generated/prisma-client';

export default {
    Query:{
        myProfile: async(_, __, {request})=>{  //__는 부모 arguments의미한다
            isAuthenticated(request);
            const {user} = request;
            const userProfile = await prisma.user({id:user.id});
            const posts = await prisma.user({
                id:user.id
            }).posts;
            const categories = await prisma.user({id:user.id}).category;
            const picks = await prisma.user({id:user.id}).picks;

            return {
                user: userProfile,
                posts,
                categories,
                picks
            }

        }
    }
}
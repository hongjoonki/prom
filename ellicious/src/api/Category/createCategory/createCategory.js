import {prisma} from '../../../../generated/prisma-client';
import {isAuthenticated} from '../../../middlewares';


export default {
    Mutation: {
        createCategory: async(_, args, {request})=>{
            isAuthenticated(request);
            const {categoryName} = args;
            const {user} = request;
            return prisma.createCategory({
                categoryName,
                user:{connect:{id: user.id}}
            })
        }
    }
}
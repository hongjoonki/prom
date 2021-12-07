import { isAuthenticated } from "../../../middlewares";
import {prisma} from '../../../../generated/prisma-client'

const DELETE= "DELETE";
const EDIT= "EDIT";

export default {
    Mutation: {
        editCategory: async (_,args,{request})=>{
            isAuthenticated(request);
            const {id, categoryName, action} = args;
            const {user} = request;

            const category = await prisma.$exists.category({id, user:{id:user.id}});
            if(category){
                if(action ===EDIT){
                    return prisma.updateCategory({
                        data:{
                            categoryName
                        },
                        where: {id}
                    });
                }else if(action === DELETE){
                    return prisma.deleteCategory({
                        id
                    });
                }
            }else{
                throw Error("can't do that")
            }
        }
    }
}
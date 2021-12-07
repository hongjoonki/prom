import { isAuthenticated } from "../../../middlewares";
import { prisma } from '../../../../generated/prisma-client';
import { ROOM_FRAGMENT } from '../../../fragments';

export default {
    Mutation: {
        updateRoom: async (_, args, { request }) => {
            isAuthenticated(request);
            const { messages, toId, roomId } = args;
            const { user } = request;
            let room;
            try {
                if (toId) {
                    room = await prisma.createRoom({
                        participants: {
                            connect: [{ id: toId }, { id: user.id }]
                        },
                        messages
                    }).$fragment(ROOM_FRAGMENT);
                } else {
                    room = await prisma.updateRoom({
                        where: {
                            id: roomId
                        },
                        data: { messages }
                    })
                }
            } catch (error) {
                console.log(error)
            } finally {
                return room;
            }

        }
    }
}
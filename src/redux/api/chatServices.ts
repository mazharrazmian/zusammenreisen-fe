import { callAPi, callAPiMultiPart, handleApiError } from "./http-common";

interface createChat {
  second_participant: string;
}
interface sendChat {
  chat_room: number;
  content: string;
}
const createRoom = async (data: createChat) => {
    try {
        const res = await callAPiMultiPart.post("/chat/chat-rooms/", data);
        return res;
    } catch (error) {
        handleApiError(error);
    }
    
    
}
const getChatRooms = (email: string) =>
  callAPi.get(`/chat/chat-rooms?email=${email}`);

const retrieveRoom = (id: number) => callAPi.get(`/chat/chat-rooms/${id}`);

const sendMessage = (data: sendChat) =>
  callAPiMultiPart.post("/chat/messages/", data);

const chatServices = {
  createRoom,
  getChatRooms,
  sendMessage,
  retrieveRoom,
};

export default chatServices;

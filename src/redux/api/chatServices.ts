import { callAPi, callAPiMultiPart, handleApiError } from "./http-common";


import { Notification } from "../../types";


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

const getNotifications = async ()=>{
    return await callAPi.get('/chat/notifications/')
}

const updateNotification = async (notification : Notification) =>{
    let id = notification.id
    let data = {
        unread : false
    }

    return await callAPi.patch(`chat/notifications/${id}/`,data=data)
}

const getChatRooms = (email: string) =>
  callAPi.get(`/chat/chat-rooms?email=${email}`);

const getChatRoomsCurrUser = ()=> callAPi.get(`/chat/chat-rooms/`);
const retrieveRoom = (id: number) => callAPi.get(`/chat/chat-rooms/${id}`);

const sendMessage = (data: sendChat) =>
  callAPiMultiPart.post("/chat/messages/", data);

const chatServices = {
  createRoom,
  getChatRooms,
  sendMessage,
  retrieveRoom,
  getChatRoomsCurrUser,
  getNotifications,
  updateNotification,
};

export default chatServices;

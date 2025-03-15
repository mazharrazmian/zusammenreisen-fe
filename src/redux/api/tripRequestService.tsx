import { callAPi, callAPiMultiPart } from "./http-common";



export const getAllRequests = () => {
    return callAPi.get(`/reisapp/post-requests`);

}
export const createRequest = (data: any) => callAPiMultiPart.post('/reisapp/post-requests/',data=data);
export const updateRequest = (id : string ,data : any) => callAPiMultiPart.patch(`/reisapp/post-requests/${id}`)

export const acceptRequest = (id : string) => callAPi.post(`/reisapp/post-requests/${id}/accept/`)
export const rejectRequest = (id : string) => callAPi.post(`/reisapp/post-requests/${id}/deny/`)


const postRequestService = {
    createRequest,
    updateRequest,
    getAllRequests,
    acceptRequest,
    rejectRequest
}

export default postRequestService;

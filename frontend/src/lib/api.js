import axiosInstance from "./axios";


export const signup = async (formData) => {
  const response = await axiosInstance.post("/auth/signup", formData);
  return response.data;
};

export const signin = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData);
  return response.data;
};

export const logout = async ()=> {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;

}

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    console.log("Error in getAuthUser: ",error);
    return null;
  }
};

export const completeOnboarding = async (formData)=> {
  const response = await axiosInstance.post('/auth/onboarding',formData);
  return response.data;
}


export const getMyFriends = async ()=> {
  const response = await axiosInstance.get('/users/friends');
  return response.data.data;
}

export const getRecommendedUsers = async ()=> {
  const response = await axiosInstance.get('/users/getRecommendations');
  return response.data.data;
}

export const getoutgoingrequests = async ()=> {
  const response = await axiosInstance.get('/users/outgoing-requests');
  return response.data.data;
}

export const sendFriendRequest = async (receiverID)=> {
    const response = await axiosInstance.post(`/users/friend-request/${receiverID}`);
    return response.data.data;
}

export const getFriendrequests = async ()=> {
  const response = await axiosInstance.get('/users/friend-requests');
  return response.data.data;
}

export const acceptFriendRequest = async (senderId)=> {
  const response = await axiosInstance.put(`/users/friend-request/${senderId}/accept`);
  return response.data.data;
}


export const getStreamToken = async ()=>{
  const response = await axiosInstance.get('/chat/token');
  return response.data;

}

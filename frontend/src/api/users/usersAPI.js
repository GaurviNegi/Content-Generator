import axios from "axios";

//!=====registration API=======
export const registerAPI = async (formData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/register",
    {
      username: formData?.username,
      email: formData?.email,
      password: formData?.password,
    },
    {
      //for cookies
      withCredentials: true,
    }
  );

  return response?.data;
};



//!====Login API====
export const loginAPI = async (formData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/login",
    {
      email: formData?.email,
      password: formData?.password,
    },
    {
      withCredentials: true,
    }
  );

  return response?.data;
};


//!===checkUserAuthStatusAPI====
export const checkUserAuthStatusAPI = async()=>{
  const response = await axios.get("http://localhost:5000/api/v1/users/auth/check",{
    withCredentials:true,
  });
  return response.data;  
}

//!====Logout API====
export const logoutAPI = async()=>{
  const response = await axios.post("http://localhost:5000/api/v1/users/logout",{},{
    withCredentials:true,
  });
  return response.data;
}

//!==== getUserProfileAPI ====
export const getUserProfileAPI = async()=>{
  const response  = await axios.get("http://localhost:5000/api/v1/users/user-profile",{
    withCredentials:true,
  });
  return response.data;
}


export const getHistoryDetailAPI = async(historyId)=>{
  
     const response = await axios.get(`http://localhost:5000/api/v1/users/history/${historyId}`,{withCredentials:true});
     return response?.data;
}

export const deleteHistoryAPI = async(historyId)=>{
  console.log("delete");
     const response = await axios.delete(`http://localhost:5000/api/v1/users/history/delete/${historyId}`,{withCredentials:true});
     
     return response?.data;
}
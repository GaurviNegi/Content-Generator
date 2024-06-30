import React from "react";
import { FaRegEdit, FaTrashAlt, FaRegClock, FaRegStar } from "react-icons/fa";
import { useParams ,useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteHistoryAPI, getHistoryDetailAPI } from "../../api/users/usersAPI";
import StatusMessage from "../alerts/StatusMessage";


const HistoryDetails = () => {
  // Dummy history data for demonstration

  const params = useParams();
  const id = params?.historyId
const navigate = useNavigate();
  //useQuery
  const {isLoading , isError ,isSuccess , data , error} = useQuery({
    queryKey:['historyData'],
    queryFn:()=>getHistoryDetailAPI(id),
  });


  //useMutation
  const mutation = useMutation({
    mutationFn:deleteHistoryAPI,
    onSuccess:navigate('/history')
  });

  const handleDeleteMutation = async()=>{
     mutation.mutate(id);
  }

console.log(mutation);

if(isLoading){
    return (<StatusMessage type="loading" message="please wait, loading data ..."/>)
}

if(isError){
    return (<StatusMessage type="error" message={error?.response?.data?.message}/>)
}

if(isSuccess){
   const {historyItem} = data;
    return (

        <div className="bg-white rounded-lg shadow-lg overflow-hidden m-4">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{historyItem?.prompt}</h2>
            <div className="flex items-center text-sm">
              <FaRegClock className="mr-2" />
              <span>{historyItem?.createdAt}</span>
            </div>
          </div>
          <div className="p-6">
            {/**mutation status  error*/}
            {mutation?.isError && <StatusMessage type="error" message={mutation?.error?.response?.data?.error}/>}

            {mutation?.isPending && <StatusMessage type="loading" message="deleting the history"/>}


            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FaRegStar className="text-yellow-400 mr-1" />
                <span className="text-lg font-semibold">Featured Article</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <FaTrashAlt className="hover:text-red-600 cursor-pointer" onClick={handleDeleteMutation}/>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{historyItem?.content}</p>
          </div>
        </div>
      );
}

};

export default HistoryDetails;
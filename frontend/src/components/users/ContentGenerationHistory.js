import React from "react";
import { FaRegEdit, FaTrashAlt, FaEye, FaPlusSquare } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import StatusMessage from "../alerts/StatusMessage";
import { getUserProfileAPI } from "../../api/users/usersAPI";
import {Link} from "react-router-dom"

const ContentGenerationHistory = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfileAPI,
  });

  if (isLoading) {
    return (
      <StatusMessage type="loading" message="Loading Data Please wait ..." />
    );
  } else if (isError) {
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  }

  console.log(data);
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Content Generation History
        </h2>
        {/* Button to create new content - functionality to be implemented */}
        <Link
          to="/generate-content"
          className="mb-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center w-72"
        >
          <FaPlusSquare className="mr-2" /> Create New Content
        </Link>

        {/* Content history list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {data?.user?.contentHistory?.length <= 0 ? (
            <h1>No content history yet</h1>
          ) : (
            <ul className="divide-y divide-gray-200">
              {/* Static example list item */}
              {data?.user?.contentHistory?.map((history) => {
                return (
                  <li className="px-6 py-4 flex items-center justify-between space-x-4">
                   <Link to={`/history/${history._id}`}>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">{history?.prompt}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {history?.content}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(history?.createdAt).toDateString()}</p>
                    </div>
                   </Link>
                    <div className="flex items-center space-x-4">
                      {/* Icons for view, edit, and delete actions - functionality to be implemented
                  <FaEye className="text-green-500 hover:text-green-600 cursor-pointer" />
                  <FaRegEdit className="text-blue-500 hover:text-blue-600 cursor-pointer" />
                  <FaTrashAlt className="text-red-500 hover:text-red-600 cursor-pointer" /> */}
                    </div>
                  </li>
                );
              })}
              {/* Additional list items can be added here */}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationHistory;

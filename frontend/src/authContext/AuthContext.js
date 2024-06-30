import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../api/users/usersAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["checkAuth"],
    queryFn: checkUserAuthStatusAPI,
  });

  //updating teh status of authenticated user 
  useEffect(() => {
    if(isSuccess){
        setIsAuthenticated(data);
    }  
  }, [data, isSuccess]);

  //update the user auth after login 
  const login = () => {
    setIsAuthenticated(true);
  };

  //update the user auth after logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider
    value={{isLoading, isError, isAuthenticated, login, logout, isSuccess}}
  >
    {children}
  </AuthContext.Provider>;
};


export const useAuth= ()=>{
    return useContext(AuthContext);
}
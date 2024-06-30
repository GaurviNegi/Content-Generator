import { useAuth } from "../../authContext/AuthContext"
import { Navigate , useLocation} from "react-router-dom";
import AuthCheckingComponent from "../alerts/AuthCheckingComponent";

const AuthRoute  = ({children})=>{  
   const location = useLocation();
   const {isLoading , isAuthenticated , isError} = useAuth();
   if(isLoading){
    return <AuthCheckingComponent/>
   }

   if(isError || isAuthenticated===false){
     return <Navigate  to="/login" state={{from:location}} replace/>
   }

   return children;

}

export default AuthRoute;
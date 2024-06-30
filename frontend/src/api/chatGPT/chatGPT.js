import axios from "axios"

//!==========generate content ==========
export const getContentAPI = async(userPrompt)=>{
 console.log(userPrompt);
    const response = await axios.post("http://localhost:5000/api/v1/openai/generate-content",{
        prompt:userPrompt,
    },{
        withCredentials:true
    });
    return response.data ;
    
}
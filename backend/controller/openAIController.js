const asyncHandler = require('express-async-handler');
const ContentHistory  = require('../model/ContentHistory');



//!using the gemini model 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../model/User');
//! Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const openAIController = asyncHandler(async(req, res)=>{
    const {prompt} = req.body;
    


    try{
        const userFound = await User.findById(req?.user?._id);
        if(!userFound){throw new Error("User Not Found")}
        if(userFound?.apiRequestCount >= userFound.monthlyRequestCount){
            throw new Error("Your monthly request limit has been reached, Please upgrade your plan");
        }
        // console.log("hello");
        // const response = await axios.post("https://api.openai.com/v1/completions",{
        //     model:"gpt-3.5-turbo-instruct",
        //     prompt,
        //     max_tokens:50
        // },{
        //     headers:{
        //         Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,
        //         "content-Type":"application/json"
        //     }
        // });
        // console.log(response.data);

        //!using gemini model instead 
          // Choose a model that's appropriate for your use case.
         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
         const result = await model.generateContent(prompt);
         const response = result.response;
         const text = response.text();
         const cleanedText = text
         .replace(/\*\*/g, '')  // Remove double asterisks
         .replace(/\*/g, '')    // Remove single asterisks
         .replace(/\\n/g, '\n')  // Replace '\n' with a space
         .replace(/\n/g, '\n')   // Replace newline characters with a space
         .replace(/\s\s+/g, ' ') // Replace multiple spaces with a single space
         .trim();
         res.json(cleanedText);

         //! create history of the content generation 
         const historyContent = await ContentHistory.create({
            user:req?.user?._id,
            content: cleanedText,
            prompt,
         });
        
        //! save this history  in user also 
        userFound?.contentHistory.push(historyContent?._id);
        userFound.apiRequestCount += 1;
        await userFound.save();
        console.log(userFound);

    }catch(error){
         res.status(500).json({error:error.message})
    }
   
});

module.exports = {openAIController}
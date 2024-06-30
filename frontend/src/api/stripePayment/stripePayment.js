//!=========Stripe Payments =======
import axios from "axios";

//==============handling free subscription API======================
export const handleFreeSubscription = async()=>{
    const response = await axios.post("http://localhost:5000/api/v1/stripe/free-plan",{},{
        withCredentials:true
    });

    return response?.data;
}



//=======stripe payment Intent API============
export const stripePaymentIntentAPI = async(payment)=>{
    console.log(payment);
   const response = await axios.post("http://localhost:5000/api/v1/stripe/checkout",{
    amount: Number(payment?.amount),
    subscriptionPlan:payment?.plan
   },{
    withCredentials:true
});
return response?.data;
};


//=======verify Payment============
export const verifyPaymentAPI = async(paymentID)=>{

   const response = await axios.post(`http://localhost:5000/api/v1/stripe/verify-payment/${paymentID}`,{},{
    withCredentials:true
});
return response?.data;
};
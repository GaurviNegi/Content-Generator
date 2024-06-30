import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient , QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {loadStripe} from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './authContext/AuthContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


//configuring the stripe
const stripePromise = loadStripe('pk_test_51PSbjf04qtMgjxEWxdhxjy6C5BGYuQEwGet5vs8b1a2i25AXaOIxGr6oafsaFjVntGHqRNbaXKdIQaKf7o2UuXgM007HFeTyGg');

const options = {
  mode:'payment',
  amount:1099,
  currency:'usd'
}
const root = ReactDOM.createRoot(document.getElementById('root'));
//creating a client 
const queryClient  = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
        <App />
        </Elements>
      </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

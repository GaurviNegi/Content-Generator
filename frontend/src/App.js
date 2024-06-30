import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/users/Register";
import Login from "./components/users/Login";
import Dashboard from "./components/users/Dashboard";
import PublicNavbar from "./components/navbar/PublicNavbar";
import PrivateNavbar from "./components/navbar/privateNavbar";
import Home from "./components/home/Home";
import { useAuth } from "./authContext/AuthContext";
import AuthRoute from "./components/authRoute/AuthRoute";
import BlogPostAIAssistant from "./contentGeneration/GenerateContent";
import Plans from "./components/plans/Plans";
import CheckoutForm from "./components/stripe/CheckoutForm";
import FreePlanSignup from "./components/stripe/FreePlanSignUp";
import PaymentSuccess from "./components/stripe/PaymentSuccess";
import ContentGenerationHistory from "./components/users/ContentGenerationHistory";
import HistoryDetails from "./components/users/HistoryDetail";
import AboutUs from "./components/about/AboutUs";
import AppFeatures from "./components/features/AppFeatures";

export default function App() {
  //!custom hook auth
  const { isAuthenticated } = useAuth();
  return (
    <>
      <BrowserRouter>
        {/**Navbar */}
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/features" element={<AppFeatures />} />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />

          <Route
            path="/generate-content"
            element={
              <AuthRoute>
                <BlogPostAIAssistant />
              </AuthRoute>
            }
          />

          <Route path="/plans" element={<Plans />} />
          <Route
            path="/free-plan"
            element={
              <AuthRoute>
                <FreePlanSignup />
              </AuthRoute>
            }
          />
          <Route
            path="/checkout/:plan"
            element={
              <AuthRoute>
                <CheckoutForm />
              </AuthRoute>
            }
          />
          <Route
            path="/success"
            element={
              <AuthRoute>
                <PaymentSuccess />
              </AuthRoute>
            }
          />
          <Route
            path="/history"
            element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            }
          />
            <Route
            path="/history/:historyId"
            element={
              <AuthRoute>
                <HistoryDetails />
              </AuthRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

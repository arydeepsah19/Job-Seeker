import { Button } from "@/components/ui/button"
import "./App.css";
import Onboarding from "./pages/onboarding";
import JobPage from "./pages/job";
import MyJob from "./pages/my-job";
import PostJob from "./pages/post-job";
import SavedJobs from "./pages/saved-job";
import JobListing from "./pages/job-listing";
import { Children } from "react";
import LandingPage from "./pages/landing";
import AppLayout from "./layouts/app-layout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider"
import ProtectedRoute from "./components/protected-route";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children : [
      {
        path: "/",
        element : <LandingPage/>
      },
      {
        path: "/onboarding",
        element : <ProtectedRoute><Onboarding/></ProtectedRoute>
      },
      {
        path: "/job/:id",
        element : <ProtectedRoute><JobPage/></ProtectedRoute>
      },
      {
        path: "/my-job",
        element : <ProtectedRoute><MyJob/></ProtectedRoute>
      },
      {
        path: "/post-job",
        element : <ProtectedRoute><PostJob/></ProtectedRoute>
      },
      {
        path: "/saved-jobs",
        element : <ProtectedRoute><SavedJobs/></ProtectedRoute>
      },
      {
        path: "/jobs",
        element : <ProtectedRoute><JobListing/></ProtectedRoute>
      }
    ]
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}/>
    </ThemeProvider>
  )
}

export default App
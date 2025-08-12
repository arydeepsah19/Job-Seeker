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
        element : <Onboarding/>
      },
      {
        path: "/job/:id",
        element : <JobPage/>
      },
      {
        path: "/my-job",
        element : <MyJob/>
      },
      {
        path: "/post-job",
        element : <PostJob/>
      },
      {
        path: "/saved-jobs",
        element : <SavedJobs/>
      },
      {
        path: "/jobs",
        element : <JobListing/>
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
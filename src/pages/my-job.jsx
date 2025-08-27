import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import CreatedJobs from "../components/created-job";
import CreatedApplications from "../components/created-applications";

const MyJob= ()=> {
  const {user, isLoaded} = useUser();

  if(!isLoaded)
  {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradiant-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate" ? "My Application" : "My Jobs"}
      </h1>

      {user?.unsafeMetadata?.role === "candidate" ? (<CreatedApplications />) : (<CreatedJobs />)}
    </div>
  )
}

export default MyJob;

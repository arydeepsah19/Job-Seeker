import { useEffect } from "react";
import { getSavedJob } from "../api/apijobs";
import useFetch from "../hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/job-card";

const  SavedJobs= ()=> {
  const{loading: loadingSavedJobs, data: savedJobs, fn: fnSavedJobs} = useFetch(getSavedJob);
  const {isLoaded} = useUser();

  useEffect(()=>{
    if(isLoaded)
    {
      fnSavedJobs();
    }
  },[isLoaded])

  if(!isLoaded || loadingSavedJobs)
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />

  return (
    <div>
      <h1 className="gradiant-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs && savedJobs.length > 0 ? (
              savedJobs.map((saved)=>{
                return <JobCard key={saved.id} job={saved.job} savedInit={true} onJobSaved={fnSavedJobs}/>
              })
            ) : (
              <div className="flex flex-col items-center justify-center col-span-full py-20 text-center relative">
              <div className="absolute -top-10 w-72 h-72 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-3xl rounded-full animate-pulse"></div>
              
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500 animate-spin-slow"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                  <span className="text-4xl animate-bounce">🥲</span>
                </div>
              </div>

              <h2 className="mt-8 text-2xl font-bold text-gray-100 tracking-wide">
                No Jobs Found
              </h2>

              <p className="mt-3 text-gray-400 text-sm max-w-md">
                Looks like your saved list is empty 🗂️  
                Start saving jobs you love and build your personal career wishlist
              </p>

              <p className="mt-4 text-xs text-gray-500 italic">
                Tip: Great opportunities come when you least expect them 🚀
              </p>
            </div>
            )}
          </div>
      )}
    </div>
  )
}

export default SavedJobs;

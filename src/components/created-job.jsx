import { useUser } from "@clerk/clerk-react";
import { getMyJob } from "../api/apijobs";
import useFetch from "../hooks/use-fetch";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";


const CreatedJob = () => {
    const {user} = useUser();

    const{loading: loadingCreatedJobs, data: createdJobs, fn: fnCreatedJobs} =useFetch(getMyJob,{
        recruiter_id: user.id,
    }
)

    useEffect(()=>{
        fnCreatedJobs()
    },[])

     if( loadingCreatedJobs)
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />

  return (
    <div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs && createdJobs.length > 0 ? (
            createdJobs.map((job)=>{
              return <JobCard key={job.id} job={job} onJobSaved={fnCreatedJobs} isMyJob/>
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
                We couldn't find any jobs matching your search.  
                Try tweaking your filters or check back soon!
              </p>

              <p className="mt-4 text-xs text-gray-500 italic">
                Tip: Great opportunities come when you least expect them 🚀
              </p>
            </div>
          )}
        </div>
    </div>
  )
}

export default CreatedJob;

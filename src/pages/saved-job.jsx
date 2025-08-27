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
              <div>No Saved Jobs Found 😶</div>
            )}
          </div>
      )}
    </div>
  )
}

export default SavedJobs;

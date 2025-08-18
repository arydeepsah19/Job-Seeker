import { useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import { getJobs } from "../api/apijobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/job-card";

const JobListing= ()=> {

  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {isLoaded} = useUser();

  const {fn : fnJobs, data: jobs, loading: loadingJobs} = useFetch(getJobs,{
    location,
    company_id,
    searchQuery
  })

  useEffect(()=>{
    if(isLoaded) fnJobs();
  }, [isLoaded,location,company_id,searchQuery]);

  if(!isLoaded){
    return <BarLoader className= "mb-4" width = {"100%"} color="#36d7b7"/>
  }

  console.log(jobs)

  return (
    <div>
      <h1 className="gradiant-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add filters here */}

      {loadingJobs && (
        <BarLoader className= "mb-4" width = {"100%"} color="#36d7b7"/>
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job)=>{
              return <JobCard key={job.id} job={job}/>
            })
          ) : (
            <div>No Jobs Found 🥲</div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobListing;

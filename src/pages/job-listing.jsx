import { useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import { getJobs } from "../api/apijobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/job-card";
import { getCompanies } from "../api/apiCompanies";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { State } from "country-state-city";

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
    console.log("Filters changed:", { location, company_id, searchQuery });
    if(isLoaded) fnJobs();
  }, [isLoaded,location,company_id,searchQuery]);

  const {fn : fnCompanies, data: companies} = useFetch(getCompanies)

  useEffect(()=>{
    if(isLoaded) {
        fnCompanies();
      }
  }, [isLoaded]);

  if(!isLoaded){
    return <BarLoader className= "mb-4" width = {"100%"} color="#36d7b7"/>
  }

  const handleSearch = (e)=>{
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if(query) setSearchQuery(query);
  }

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  }

  return (
    <div className="">
      <h1 className="gradiant-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add filters here */}

      <form onSubmit={handleSearch} className="h-12 flex w-full gap-2 items-center mb-3">
        <Input type="text" placeholder="Search Jobs by title...." name="search-query" className="h-full flex-1 px-4 text-md" />
        <Button type="submit" variant="blue" className="h-full sm:w-28">Search</Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value)=> setLocation(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({name})=>{
                return(
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
         <Select value={company_id} onValueChange={(value)=> setCompany_id(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Comapany" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant='destructive' className="sm:w-1/3">Clear Filter</Button>
      </div>

      {loadingJobs && (
        <BarLoader className= "m-2" width = {"100%"} color="#36d7b7"/>
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job)=>{
              return <JobCard key={job.id} job={job} savedInit={job?.saved?.length >0}/>
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
      )}
    </div>
  )
}

export default JobListing;

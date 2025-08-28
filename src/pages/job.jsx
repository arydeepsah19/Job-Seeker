import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { getSingleJob, updateHiringStatus } from "../api/apijobs";
import { useEffect} from "react";
import { BarLoader } from "react-spinners";
import useFetch from "../hooks/use-fetch";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/select";
import ApplyJobDrawer from "../components/apply-job";
import ApplicationCard from "../components/application-card";

const JobPage= ()=> {
  const {isLoaded, user} = useUser();
  const {id} = useParams();

  const {fn : fnJobs, data: job, loading: loadingJobs} = useFetch(getSingleJob,{
    job_id: id,
  });

  const {fn : fnHiringStatus, loading: loadingHiringStatus} = useFetch(updateHiringStatus,{
    job_id: id,
  });

  const handleStatusChange = (value)=>{
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(()=> fnJobs());
  }


  useEffect(()=>{
    if(isLoaded) fnJobs();
  },[isLoaded])

  if(!isLoaded && loadingJobs){
    return <BarLoader className= "mb-4" width = {"100%"} color="#36d7b7"/>
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradiant-title font-extrabold text-4xl pb-3 sm:text-6xl">{job?.title}</h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.application?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? <><DoorOpen /> Open</> : <><DoorClosed /> Closed</>}
        </div>
      </div>

      {/* hiring status */}
      {loadingHiringStatus && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
      {job?.recruiter_id === user?.id && (
        <Select key={job?.isOpen} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full" style={{ backgroundColor: job?.isOpen ? "#022c22" : "#3b0d0c" }}>
            <SelectValue placeholder={"Hiring Status "+ (job?.isOpen ? "( Open )" : "( Closed )")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem  value="open">Open</SelectItem>
            <SelectItem  value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p>{job?.description}</p>

      <h2 className="text-3xl sm:text-3xl font-bold">
        What we are looking for
      </h2>

      <MDEditor.Markdown source={job?.requirements} style={{ backgroundColor: 'transparent', fontSize: '1.125rem' }}/>

      {/* render applications */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer job={job}
        user = {user}
        fetchJob = {fnJobs}
        applied = {job?.application?.find((ap) => ap.candidate_id === user.id)}/>
      )}

      {job?.application.length > 0 && job?.recruiter_id === user.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          {job?.application.map((application)=> {
            return <ApplicationCard key={application.id} application={application}/>
          })}
        </div>
      )}
    </div>
  )
}

export default JobPage;

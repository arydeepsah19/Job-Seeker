import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { getSingleJob, updateHiringStatus } from "../api/apijobs";
import { withdrawApplication } from "../api/apiApplication";
import { useEffect } from "react";
import useFetch from "../hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import ApplyJobDrawer from "../components/apply-job";
import ApplicationCard from "../components/application-card";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Swal from "sweetalert2";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const { fn: fnJobs, data: job, loading: loadingJobs } = useFetch(getSingleJob, { job_id: id });
  const { fn: fnHiringStatus, loading: loadingHiringStatus } = useFetch(updateHiringStatus, { job_id: id });


  // Check applications
  const myApplication = job?.application?.find(
    (ap) => ap.candidate_id === user?.id
  );

  const { fn: fnWithdraw, loading: loadingWithdraw } = useFetch(withdrawApplication, { application_id: myApplication?.id, resumeUrl: myApplication?.resume});

  // Refresh job data when loaded
  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingJobs) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJobs());
  };

  return (
    <div className="flex flex-col gap-8 mt-5">
      {/* Job Header */}
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradiant-title font-extrabold text-4xl pb-3 sm:text-6xl">{job?.title}</h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      {/* Job Info */}
      <div className="flex justify-between">
        <div className="flex gap-2"><MapPinIcon />{job?.location}</div>
        <div className="flex gap-2"><Briefcase /> {job?.application?.length || 0} Applicants</div>
        <div className="flex gap-2">{job?.isOpen ? <><DoorOpen /> Open</> : <><DoorClosed /> Closed</>}</div>
      </div>

      {/* Hiring Status for recruiter */}
      {job?.recruiter_id === user?.id && (
        <>
          {loadingHiringStatus && <BarLoader className="mb-4" width="100%" color="#36d7b7" />}
          <Select key={job?.isOpen} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full" style={{ backgroundColor: job?.isOpen ? "#022c22" : "#3b0d0c" }}>
              <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {/* Job Description */}
      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p>{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
      <MDEditor.Markdown source={job?.requirements} style={{ backgroundColor: 'transparent', fontSize: '1.125rem' }} />

      {/* Apply / Withdraw Button */}
      {job?.recruiter_id !== user?.id && (
        myApplication ? (
          <Button
  variant="destructive"
  disabled={loadingWithdraw}
  onClick={async () => {
    if (!myApplication?.id) {
      console.error("❌ Cannot withdraw: application ID is missing", myApplication);
      return;
    }

    try {
      // 1️⃣ Withdraw application from DB
      await fnWithdraw({
        application_id: myApplication.id,
        resumeUrl: myApplication.resume
      });

      fnJobs(); // refresh job data

      // 2️⃣ Notify recruiter via Edge Function
      await fetch("https://spqpxjcfwynwxfgcfday.supabase.co/functions/v1/super-processor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: "withdraw",
          email: user?.primaryEmailAddress?.emailAddress, 
          jobTitle: job.title,
          recruiterEmail: job?.recruiter_email
        }),
      });

      // 3️⃣ SweetAlert confirmation
      Swal.fire({
        title: '🗑️ Application Withdrawn!',
        text: `You have successfully withdrawn your application for ${job.title}.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        background: '#f0f9ff'
      });

    } catch (err) {
      console.error("Withdraw failed:", err);
      Swal.fire({
        title: '❌ Failed to Withdraw',
        text: 'Something went wrong while withdrawing your application. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  }}
>
  {loadingWithdraw ? (
    <div className="flex items-center gap-2">
      <BarLoader width={50} height={4} color="#fff" />
      <span>Withdrawing...</span>
    </div>
  ) : (
    "Withdraw Application"
  )}
</Button>

        ) : (
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJobs}
            applied={false}
          />
        )
      )}

      {/* Applications list for recruiter */}
      {job?.application?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          {job.application.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPage;


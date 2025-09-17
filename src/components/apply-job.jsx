import {Drawer,DrawerClose,DrawerContent,DrawerDescription,DrawerFooter,DrawerHeader,DrawerTitle,DrawerTrigger,} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {z} from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "../hooks/use-fetch";
import { applyToJob } from "../api/apiApplication";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import { createNotification } from "../api/apiNotifications";
import useFetch from "../hooks/use-fetch";


const schema = z.object({
    experience : z.number().min(0, {message: "Experience must be atleast 0"}).int(),
    skills: z.string().min(1, {message: "Skills are required"}),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {message: "Education is required"}),
    resume: z.any().refine(
        (file)=> file[0] && (file[0].type === "application/pdf" || file[0].type === "application/msword"), {message: "Only PDF or Word documents are allowed"}
    ),
})

const ApplyJobDrawer = ({user, job, applied=false, fetchJob}) => {

    const { user: clerkUser } = useUser();

    const {register, handleSubmit, control, formState:{errors}, reset,}= useForm({
        resolver: zodResolver(schema)
    })

    const {loading: loadingApply, error: errorApply, fn: fnApply} = useFetch(applyToJob);
    const {fn: fnCreateNotification} = useFetch(createNotification);

    const onSubmit = async (data) => {
    try {
      await fnApply({
        ...data,
        job_id: job.id,
        candidate_id: user.id,
        name: user.fullName,
        status: "applied",
        resume: data.resume[0],
      });

      fetchJob();
      reset();

      // Create success notification for candidate
      try {
        await fnCreateNotification({
          user_id: user.id,
          type: "application_success",
          title: "Application Submitted Successfully!",
          message: `Your application for ${job.title} at ${job.company?.name} has been submitted successfully.`,
          data: {
            job_id: job.id,
            company_name: job.company?.name,
            job_title: job.title
          }
        });
      } catch (notificationError) {
        console.error("Error creating success notification:", notificationError);
      }
      // ✅ Send confirmation email to applicant + recruiter
      const response = await fetch(
        "https://spqpxjcfwynwxfgcfday.supabase.co/functions/v1/super-processor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: "apply",
            email: clerkUser?.primaryEmailAddress?.emailAddress,
            recruiterEmail: job.recruiter_email,   // ✅ comes directly from jobs table
            jobTitle: job.title,
            companyName: job.company?.name,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: '🎉 Application Submitted!',
          html: `
            <p>You’ve applied for <strong>${job.title}</strong> at <strong>${job.company?.name}</strong>.</p>
            <p>A confirmation email was sent to <strong>${clerkUser?.primaryEmailAddress?.emailAddress}</strong>.</p>
            <p>Stay tuned for the next steps!</p>
          `,
          confirmButtonText: 'Awesome!',
          confirmButtonColor: '#2563eb',
          background: '#f0f9ff',
        });
      } else {
        console.error("Email failed:", await response.text());
        Swal.fire({
          title: "📬 Submitted, but email failed!",
          text: "We couldn’t send a confirmation email, but your application was received.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        title: "❌ Oops!",
        text: "Something went wrong while submitting your application. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };


  return (
    <Drawer open = {applied ?false : undefined}>
        <DrawerTrigger asChild>
            <Button size="lg" variant={job?.isOpen && !applied ? "blue" : "destructive"} disabled={!job?.isOpen || applied}>
                {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
            </Button>
        </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Apply for {job?.title} at {job?.company?.name}</DrawerTitle>
                    <DrawerDescription>Please fill the form below.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
                   <Input
                   type = "number"
                   placeholder="Years of Experience"
                   className="flex-1" 
                   {...register("experience", {valueAsNumber: true})}/>
                   {errors.experience && (<p className="text-red-500">{errors.experience.message}</p>)}

                   <Input
                   type = "text"
                   placeholder="Skills (Comma Separated)"
                   className="flex-1" 
                   {...register("skills")}/>
                   {errors.skills && (<p className="text-red-500">{errors.skills.message}</p>)}
                   
                   <Controller
                   name="education"
                   control={control}
                   render={({field}) =>(
                    <RadioGroup onValueChange={field.onChange} {...field}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Intermediate" id="intermediate" />
                            <Label htmlFor="intermediate">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Graduate" id="graduate" />
                            <Label htmlFor="graduate">Graduate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Post Graduate" id="post-graduate" />
                            <Label htmlFor="post-graduate">Post Graduate</Label>
                        </div>
                    </RadioGroup>
                   )} />
                   {errors.education && (<p className="text-red-500">{errors.education.message}</p>)}

                    <Input
                    type = "file"
                    accept=".pdf,.doc,.docx"
                    className="flex-1 file:text-gray-500"
                    {...register("resume")}/>
                    {errors.resume && (<p className="text-red-500">{errors.resume.message}</p>)}

                    {errorApply?.message && (<p className="text-red-500">{errorApply.message}</p>)}

                    {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

                    <Button variant="blue" type="submit" size="lg">Apply</Button>
                </form>
            <DrawerFooter>
                <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>

  )
}

export default ApplyJobDrawer;

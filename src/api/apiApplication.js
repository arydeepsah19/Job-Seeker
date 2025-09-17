 import supabaseClient, { supabaseUrl } from "../utils/supabase";

export async function applyToJob(token, _, jobData) {
    const supabase = await  supabaseClient(token);

    const random = Math.floor(Math.random()*9000);
    const fileName = `resume-${random}-${jobData.candidate_id}`

    const {error: StorageError} = await supabase.storage
        .from("resumes")
        .upload(fileName, jobData.resume);

    if(StorageError)
    {
        console.log("Error Uploading Resume:", StorageError);
        return null;
    }

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const {data,error} = await supabase.from("applications").insert([
        {...jobData, resume}
    ]).select();

    if(error){
        console.error("Error Submitting Applications:", error);
        return null;
    }

    // Create notification for recruiter
    if (data && data.length > 0) {
        try {
            // Get job details to find recruiter
            const { data: jobData, error: jobError } = await supabase
                .from("jobs")
                .select("recruiter_id, title, company:companies(name)")
                .eq("id", data[0].job_id)
                .single();

            if (!jobError && jobData) {
                await supabase.rpc("create_notification", {
                    p_user_id: jobData.recruiter_id,
                    p_type: "application_received",
                    p_title: "New Application Received",
                    p_message: `${data[0].name} has applied for ${jobData.title} at ${jobData.company?.name}`,
                    p_data: {
                        job_id: data[0].job_id,
                        application_id: data[0].id,
                        candidate_name: data[0].name
                    }
                });
            }
        } catch (notificationError) {
            console.error("Error creating notification:", notificationError);
        }
    }
    return data;
}

export async function updateApplicationStatus(token, {application_id}, status) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("applications")
        .update({status})
        .eq("id", application_id)
        .select()

    if(error || data.length === 0)
    {
        console.log("Error Updating Application Status:", error);
        return null;
    }

    // Create notification for candidate
    if (data && data.length > 0) {
        try {
            // Get job details
            const { data: jobData, error: jobError } = await supabase
                .from("jobs")
                .select("title, company:companies(name)")
                .eq("id", data[0].job_id)
                .single();

            if (!jobError && jobData) {
                const statusMessages = {
                    'applied': 'Your application has been received',
                    'interviewing': 'You have been selected for an interview',
                    'hired': 'Congratulations! You have been hired',
                    'rejected': 'Your application was not selected'
                };

                await supabase.rpc("create_notification", {
                    p_user_id: data[0].candidate_id,
                    p_type: "application_status",
                    p_title: "Application Status Updated",
                    p_message: `${statusMessages[status]} for ${jobData.title} at ${jobData.company?.name}`,
                    p_data: {
                        job_id: data[0].job_id,
                        application_id: data[0].id,
                        status: status
                    }
                });
            }
        } catch (notificationError) {
            console.error("Error creating notification:", notificationError);
        }
    }
    return data;
}

export async function getApplication(token, {user_id} ) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("applications")
        .select("*, job: jobs(title, company: companies(name))")
        .eq("candidate_id", user_id);

    if(error)
    {
        console.error("Error Fetching Application:", error);
        return null;
    }
    return data;
}


export async function withdrawApplication(token, { application_id, resumeUrl }) {
  const supabase = await supabaseClient(token);

  try {
    // 1️⃣ Get job status from application
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, job_id, candidate_id, name, jobs(isOpen, title, recruiter_id, company:companies(name))")
      .eq("id", application_id)
      .single();

    if (appError || !application) throw new Error("Application not found.");

    if (!application.jobs?.isOpen) {
      return { success: false, message: "Hiring is closed. Withdrawals are not allowed." };
    }

    // 2️⃣ Delete application
    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", application_id);

    if (deleteError) throw deleteError;

    // 3️⃣ Delete resume file (optional cleanup)
    if (resumeUrl) {
      const fileName = resumeUrl.split("/").pop();
      await supabase.storage.from("resumes").remove([fileName]);
    }

    // 4️⃣ Create notification for recruiter
    try {
      await supabase.rpc("create_notification", {
        p_user_id: application.jobs.recruiter_id,
        p_type: "application_withdrawn",
        p_title: "Application Withdrawn",
        p_message: `${application.name} has withdrawn their application for ${application.jobs.title} at ${application.jobs.company?.name}`,
        p_data: {
          job_id: application.job_id,
          candidate_name: application.name
        }
      });
    } catch (notificationError) {
      console.error("Error creating withdrawal notification:", notificationError);
    }
    return { success: true };
  } catch (err) {
    console.error("🔥 withdrawApplication failed:", err);
    throw err;
  }
}

